import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <Link href="/" className="flex items-center">
            <Image 
              src="/images/logoefc.png" 
              alt="EFC" 
              width={100} 
              height={30}
              className="h-8 w-auto"
              priority
            />
          </Link>
        </div>
      </div>
    </header>
  )
}