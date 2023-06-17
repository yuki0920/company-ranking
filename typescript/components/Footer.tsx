import Link from 'next/link'

export default function Footer() {
  return (
    <div>
      <div className="bg-base-content/10 my-10 mx-1 h-px">
      </div>
      <footer className="py-2">
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
    </div>
  )
}
