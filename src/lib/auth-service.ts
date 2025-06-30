// lib/auth-service.ts

const AUTHORIZED_GROUP = "appbip";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Cache en memoria para reducir llamadas al AD
const userGroupCache = new Map<string, { groups: string[], timestamp: number }>();

/**
 * Verifica si un usuario pertenece al grupo autorizado
 * En producción, esto se conecta con Active Directory/LDAP
 */
export async function verifyUserGroup(email: string): Promise<{
  isAuthorized: boolean;
  groups?: string[];
  message?: string;
}> {
  try {
    // Verificar cache primero
    const cached = userGroupCache.get(email);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      const hasAccess = cached.groups.includes(AUTHORIZED_GROUP);
      return {
        isAuthorized: hasAccess,
        groups: cached.groups,
        message: hasAccess ? "Acceso autorizado" : `Acceso denegado. Usuario no pertenece al grupo '${AUTHORIZED_GROUP}'.`
      };
    }

    // Llamar a la API interna que se conecta con AD
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.API_KEY || '', // Si usas API key interna
      },
      body: JSON.stringify({ email }),
      // Timeout de 10 segundos
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Guardar en cache
    if (data.groups) {
      userGroupCache.set(email, {
        groups: data.groups,
        timestamp: Date.now()
      });
    }

    return {
      isAuthorized: data.isAuthorized,
      groups: data.groups,
      message: data.message
    };

  } catch (error) {
    console.error('Error verificando grupos del usuario:', error);
    
    // En caso de error, verificar si el usuario está en una lista de emergencia
    const emergencyAccess = await checkEmergencyAccess(email);
    if (emergencyAccess) {
      return {
        isAuthorized: true,
        groups: ['emergency_access'],
        message: "Acceso de emergencia concedido"
      };
    }

    return {
      isAuthorized: false,
      message: "Error al verificar permisos. Por favor contacta a soporte IT."
    };
  }
}

/**
 * Lista de acceso de emergencia en caso de falla del AD
 * Debería estar en variables de entorno
 */
async function checkEmergencyAccess(email: string): Promise<boolean> {
  const emergencyUsers = (process.env.EMERGENCY_ACCESS_USERS || '').split(',').map(e => e.trim().toLowerCase());
  return emergencyUsers.includes(email.toLowerCase());
}

/**
 * Obtiene información adicional del usuario desde AD
 */
export async function getUserInfo(email: string): Promise<{
  email: string;
  name?: string;
  department?: string;
  title?: string;
  manager?: string;
} | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/user/info`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.API_KEY || '',
      },
      body: JSON.stringify({ email }),
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    return await response.json();
  } catch (error) {
    console.error('Error obteniendo información del usuario:', error);
    return null;
  }
}

/**
 * Limpia el cache de un usuario específico
 */
export function clearUserCache(email?: string) {
  if (email) {
    userGroupCache.delete(email);
  } else {
    userGroupCache.clear();
  }
}

/**
 * Registra actividad de login para auditoría
 */
export async function logLoginAttempt(email: string, success: boolean, ip?: string) {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/audit/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.API_KEY || '',
      },
      body: JSON.stringify({
        email,
        success,
        ip,
        timestamp: new Date().toISOString(),
        application: 'bip-frontend'
      }),
    });
  } catch (error) {
    console.error('Error registrando intento de login:', error);
    // No fallar el login por no poder auditar
  }
}