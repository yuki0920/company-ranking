import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="py-2 bg-base-300">
      <div className="text-center">
        <ul className="flex justify-center mb-3 space-x-4">
          <li>
            <Link href={{ pathname: "/terms_of_service" }} className="link link-hover">利用規約</Link>
          </li>
          <li>
            <Link href={{ pathname: "/contact" }} className="link link-hover">お問い合わせ</Link>
          </li>
        </ul>
        {/* <small className="">Copyright &copy;上場企業ランキング</small> */}
      </div>
    </footer>
  )
}
