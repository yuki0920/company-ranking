import { Metadata } from "next"

export const metadata: Metadata = {
  title: "利用規約",
}

export default function TermsOfUse() {
  return (
    <div className='container'>
      <div className='mt-3'>
        <div>
          <div>
            <h1 className='text-xl'>利用規約(Japanese Only)</h1>
            <p>
              この利用規約（以下，「本規約」といいます。）はこのウェブサイト上で提供するサービス（以下，「本サービス」といいます。）の利用条件を定めるものです。ユーザーの皆さまには，本規約に従って，本サービスをご利用いただきます。
            </p>

            <h2 className='text-lg'>第1条（適用）</h2>
            <ol className='list-decimal'>
              <li className='ml-5'>
                本規約は，本サービスの利用に関わる一切の関係に適用されるものとします。
              </li>
              <li className='ml-5'>
                本サービスに関し，本規約のほか，ご利用にあたってのルール等，各種の定め（以下，「個別規定」といいます。）をすることがあります。これら個別規定はその名称のいかんに関わらず，本規約の一部を構成するものとします。
              </li>
              <li className='ml-5'>
                本規約の規定が前条の個別規定の規定と矛盾する場合には，個別規定において特段の定めなき限り，個別規定の規定が優先されるものとします。
              </li>
            </ol>

            <h2 className='text-lg'>第2条（禁止事項）</h2>
            <p>本サービスの利用にあたり，以下の行為をしてはなりません。</p>

            <ol className='list-decimal'>
              <li className='ml-5'>本サービスによって得られた情報を商業的に利用する行為</li>
              <li className='ml-5'>スクレイピング，またはこれを試みる行為</li>
            </ol>

            <h2 className='text-lg'>第3条（サービス内容の変更等）</h2>
            <p>
              通知することなく，本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし，これによってユーザーに生じた損害について一切の責任を負いません。
            </p>

            <h2 className='text-lg'>第4条（利用規約の変更）</h2>
            <p>
              通知することなくいつでも本規約を変更することができるものとします。なお，本規約の変更後，本サービスの利用を開始した場合には，当該ユーザーは変更後の規約に同意したものとみなします。
            </p>

            <p>以上</p>
          </div>
        </div>
      </div>
    </div>
  )
}
