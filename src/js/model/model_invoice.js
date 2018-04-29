export default class ModelInvoice {
  constructor () {
    this.id = -1
    this.name = ''
    this.message = ''
    this.senderAddr = ''
    this.currencyItem = {}
    this.amount = 0
    this.mosaics = []
    this.num = 1
    this.designItem = {}
    this.createDate = new Date()
    this.updateDate = new Date()
  }
}
