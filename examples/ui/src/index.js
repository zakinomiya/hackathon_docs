'use strict'

const IOST = require('iost')
const TEST_NET = 'http://13.52.105.102:30001'

let accountDisplay, iwallet, iost, fetchContractButton, fetchStorageForm, storageDisplay

// RPCインスタンスの初期化（テストネット用）
// これでテストネットのIOSTネットワークから
// 情報を読み取ったりできるように設定しています。
const rpc = new IOST.RPC(new IOST.HTTPProvider(TEST_NET))

// 拡張機能からアカウントを読み込んで
// IOSTクラスのインスタンスを返す
const loadAccount = async () => {
  if (!window.IWalletJS) return
  try {
    iwallet = window.IWalletJS
    const account = await iwallet.enable()
    iost = iwallet.newIOST(IOST)
    iost.setRPC(rpc)
    iost.setAccount(account)
    accountDisplay.innerHTML = iwallet.account.name
  } catch (err) {
    // インストールはしているけれどログインしていない状態
    if (err.type === 'locked') return alert('Iwalletにログインしてください')
    console.log(err)
  }
}

const fetchContract = () => {
  const contractId = document.getElementById('contract-id').value
  // コントラクトを取得する関数
  rpc.blockchain.getContract(contractId)
    .then(res => {
      console.log(res)
      displayFunctions(res.id, res.abis)
    })
}

// フォームからキーとフィールドを読み取ってコントラクトのストレージを取得する
const fetchStorage = (id) => {
  const form = document.forms['fetch-storage-form']
  const key = form.elements[0].value
  const field = form.elements[1].value
  console.log(id, key, field)

  // コントラクトからストレージを取得する関数
  rpc.blockchain.getContractStorage(id, key, field)
    .then(res => {
      storageDisplay = document.getElementById('storage-display')
      storageDisplay.innerHTML = res.data
    })
}

/**
 *
 * @param {string} id
 * @param {Array} abis
 *
 * abisは以下のようになっている
 *  [{
 *      name: 'helloFunction'
 *      args: ['string', 'number']
 * }]
 */

const displayFunctions = (id, abis) => {
  const contractInfo = document.getElementById('contract-info')
  contractInfo.innerHTML = `
    <h5>${id}</5>
    <p>コントラクト内の関数</p>
    <ul>
      ${abis.map(abi => `
        <li class="abi-list">
          <p>${abi.name}</p>
          <ul>
            ${abi.args.map((arg, i) => `<li>第${i + 1}引数: ${arg}</li>`)}
          </ul>
        </li>
      `)}
    </ul>
    <p>コントラクト内のストレージを取得</p>
    <form id="fetch-storage-form" name="fetch-storage-form">
      <input type="text" placeholder="キー"/>
      <input type="text" placeholder="フィールド"/>
      <input type="submit" value="探す" />
  </form>
 `
  fetchStorageForm = document.getElementById('fetch-storage-form')
  fetchStorageForm.addEventListener(
    'submit',
    (e) => {
      e.preventDefault()
      fetchStorage(id)
    })
}

// ページを読み込んだ時に起動
const init = () => {
  let retry = 0
  accountDisplay = document.getElementById('account-display')
  fetchContractButton = document.getElementById('fetch-contract-button')
  fetchContractButton.addEventListener('click', (e) => fetchContract(e))

  // iwallet変数にアカウント情報をロードできるまでロードする
  // 100リトライした時点でインストールしていないと判断してリロードする
  const load = setInterval(() => {
    if (retry === 100) {
      alert('IWalletをインストールしてください')
      window.location.reload()
    }
    if (!iwallet) {
      loadAccount()
    } else {
      clearInterval(load)
    }
    retry++
  })
}
Window.onload = init()
