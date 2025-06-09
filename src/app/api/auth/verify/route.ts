import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import ldap from 'ldapjs'; // npm install ldapjs @types/ldapjs

// Configuración LDAP
const LDAP_CONFIG = {
  url: process.env.LDAP_URL || 'ldap://dc.efc.com.pe:389',
  bindDN: process.env.LDAP_BIND_DN || 'CN=ServiceAccount,OU=Service Accounts,DC=efc,DC=com,DC=pe',
  bindPassword: process.env.LDAP_BIND_PASSWORD || '',
  searchBase: process.env.LDAP_SEARCH_BASE || 'DC=efc,DC=com,DC=pe',
  groupSearchBase: process.env.LDAP_GROUP_SEARCH_BASE || 'OU=Groups,DC=efc,DC=com,DC=pe',
};

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    // Verificar API key si está configurada
    const apiKey = headers().get('X-API-Key');
    if (process.env.API_KEY && apiKey !== process.env.API_KEY) {
      return NextResponse.json(
        { isAuthorized: false, message: "No autorizado" },
        { status: 401 }
      );
    }

    // Obtener grupos del usuario desde AD
    const userGroups = await getUserGroupsFromAD(email);
    
    const hasAccess = userGroups.includes('appbip');
    
    return NextResponse.json({
      isAuthorized: hasAccess,
      groups: userGroups,
      message: hasAccess 
        ? "Acceso autorizado" 
        : `Acceso denegado. Usuario no pertenece al grupo 'appbip'.`
    });

  } catch (error) {
    console.error('Error en verificación:', error);
    return NextResponse.json(
      { isAuthorized: false, message: "Error del servidor" },
      { status: 500 }
    );
  }
}

async function getUserGroupsFromAD(email: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const client = ldap.createClient({
      url: LDAP_CONFIG.url,
      timeout: 5000,
      connectTimeout: 5000,
    });

    const groups: string[] = [];

    client.bind(LDAP_CONFIG.bindDN, LDAP_CONFIG.bindPassword, (err) => {
      if (err) {
        client.unbind();
        reject(new Error('LDAP bind failed'));
        return;
      }

      // Buscar usuario
      const searchOptions = {
        filter: `(&(objectClass=user)(mail=${email}))`,
        scope: 'sub' as const,
        attributes: ['memberOf', 'cn', 'displayName'],
      };

      client.search(LDAP_CONFIG.searchBase, searchOptions, (err, res) => {
        if (err) {
          client.unbind();
          reject(err);
          return;
        }

        res.on('searchEntry', (entry) => {
          const memberOf = entry.object.memberOf;
          if (memberOf) {
            const groupList = Array.isArray(memberOf) ? memberOf : [memberOf];
            groupList.forEach((group: string) => {
              // Extraer el CN del grupo
              const match = group.match(/CN=([^,]+)/);
              if (match) {
                groups.push(match[1]);
              }
            });
          }
        });

        res.on('error', (err) => {
          client.unbind();
          reject(err);
        });

        res.on('end', () => {
          client.unbind();
          resolve(groups);
        });
      });
    });

    client.on('error', (err) => {
      reject(err);
    });
  });
}