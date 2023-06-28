import Link from 'next/link'
import ThemeChangeMenu from '@/components/ThemeChangeMenu'

export default function Header({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="w-full navbar">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </label>
          </div>
          <div className="flex-1 px-2 mx-2 text-xl font-mono font-bold">
            <Link href={{ pathname: "/" }}>
              <span className="text-accent">上場企業</span>
              <span>ランキング</span>
            </Link>
            </div>
          <div className="flex-none hidden lg:block">
            <ul className="menu menu-horizontal">
              {/* Navbar menu content here */}
              <li>
                <Link href={{ pathname: "/companies" }}>すべての企業</Link>
              </li>
              <li>
                <Link href={{ pathname: "/terms_of_use" }}>利用規約</Link>
              </li>
            </ul>
            <ThemeChangeMenu />
          </div>
        </div>
        {/* Page content here */}
        {children}
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 h-full bg-base-200">
          {/* Sidebar content here */}
          <li>
            <Link href={{ pathname: "/" }}>Top</Link>
          </li>
          <li>
            <Link href={{ pathname: "/companies" }}>すべての企業</Link>
          </li>
          <li>
            <Link href={{ pathname: "/markets/1" }}>・プライム市場の企業</Link>
          </li>
          <li>
            <Link href={{ pathname: "/markets/2" }}>・スタンダード市場の企業</Link>
          </li>
          <li>
            <Link href={{ pathname: "/markets/3" }}>・グロース市場の企業</Link>
          </li>
          <li>
            <Link href={{ pathname: "/terms_of_use" }}>利用規約</Link>
          </li>
          <li>
            <Link href={{ pathname: "/contact" }}>お問い合わせ</Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
