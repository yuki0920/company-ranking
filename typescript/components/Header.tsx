import Link from "next/link"
import ThemeChangeMenu from "@/components/ThemeChangeMenu"
import LocaleSwitcher from "@/components/LocaleSwitcher"

export default function Header({
  children,
  lang,
  dict,
}: {
  children: React.ReactNode
  lang: string
  dict: {
    firstTitle: string
    lastTitle: string
    links: {
      top: string
      all: string
      market1: string
      market2: string
      market3: string
      termsOfUse: string
      contact: string
    }
  }
}) {
  return (
    <div className='drawer'>
      <input id='my-drawer-3' type='checkbox' className='drawer-toggle' />
      <div className='drawer-content flex flex-col'>
        {/* Navbar */}
        <div className='w-full navbar'>
          <div className='flex-none lg:hidden'>
            <label htmlFor='my-drawer-3' className='btn btn-square btn-ghost'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                className='inline-block w-6 h-6 stroke-current'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M4 6h16M4 12h16M4 18h16'
                ></path>
              </svg>
            </label>
          </div>
          <div className='flex-1 px-2 mx-2 text-xl font-mono font-bold'>
            <Link href={{ pathname: `/${lang}` }}>
              <span className='text-accent'>{dict.firstTitle} </span>
              <span>{dict.lastTitle}</span>
            </Link>
          </div>
          <div className='flex-none hidden lg:block'>
            <ul className='menu menu-horizontal'>
              {/* Navbar menu content here */}
              <li>
                <Link href={{ pathname: `/${lang}/companies` }}>{dict.links.all}</Link>
              </li>
              <li>
                <Link href={{ pathname: `/${lang}/terms_of_use` }}>{dict.links.termsOfUse}</Link>
              </li>
            </ul>
            <LocaleSwitcher />
            <ThemeChangeMenu />
          </div>
        </div>
        {/* Page content here */}
        {children}
      </div>
      <div className='drawer-side'>
        <label htmlFor='my-drawer-3' className='drawer-overlay'></label>
        <ul className='menu p-4 w-80 h-full bg-base-200'>
          {/* Sidebar content here */}
          <li>
            <Link href={{ pathname: `/${lang}` }}>Top</Link>
          </li>
          <li>
            <Link href={{ pathname: `/${lang}/companies` }}>- {dict.links.all}</Link>
          </li>
          <li>
            <Link href={{ pathname: `/${lang}/markets/1` }}>- {dict.links.market1}</Link>
          </li>
          <li>
            <Link href={{ pathname: `/${lang}/markets/2` }}>- {dict.links.market2}</Link>
          </li>
          <li>
            <Link href={{ pathname: `/${lang}/markets/3` }}>- {dict.links.market3}</Link>
          </li>
          <li>
            <Link href={{ pathname: `/${lang}/terms_of_use` }}>{dict.links.termsOfUse}</Link>
          </li>
          <li>
            <Link href={{ pathname: `/${lang}/contact` }}>{dict.links.contact}</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
