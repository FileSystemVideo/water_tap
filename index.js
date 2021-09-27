var langJson = {
  cn: {
    tit: '寻找测试 (FSV) 币？',
    p1: '填写您的钱包地址以获得500FSV，每钱包地址只能获取一次',
    p2: '我们会在每天的8点，12点，16点，进行测试FSV的发放（迪拜时间）',
    placeholder: '请输入测试钱包地址',
    btn: '提交',
    message: '领取错误，请稍后后重试'
  },
  en: {
    tit: 'Looking for Test (FSV) Coins？',
    p1: 'Fill out your test wallet address to receive 5000 FSV , a purse can only be used once',
    p2: 'We will test FSV distribution daily at 8am,12am,4pm（Dubai Time）',
    placeholder: 'Test wallet address',
    btn: 'SUBMIT',
    message: 'Receive error, please try again later'
  }
}

var app = new Vue({
  el: '#app',
  data: {
    showLangList: false,
    langType: 'en',
    lang: langJson['en'],
    address: '',
    MsgVisible: false,
    message: '',
    timer: null,
    loading: false
  },
  mounted () {
  },
  methods: {
    submit () {
      if (this.loading) {
        return
      }
      var that = this
      var address = this.address.toLowerCase()
      if (!address) {
        this.showMsg(this.lang['placeholder'])
        return
      }
      var reg = /^[a-z0-9]{42}$/i
      if (!address.startsWith('fsv') || !reg.test(address))  {
        this.showMsg(this.lang['message'])
        return
      }
      this.loading = true
      axios({
        url: 'https://dapp.fs.video/wallet',
        method: 'post',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        timeout: 10000,
        params: {
          address: address,
          lang: this.langType
        }
      })
      .then(function (response) {
        console.log('axios success')
        console.log(response)
        setTimeout(function () { 
          that.loading = false
        }, 400)
        var data = response.data
        if (data && data.info) {
          that.showMsg(data.info)
        }
      })
      .catch(function (error) {
        console.log('axios error')
        console.log(error.response)
        setTimeout(function () { 
          that.loading = false
        }, 400)
        var response = error.response
        if (error && response && response.data && response.data.info) {
          that.showMsg(response.data.info)
        } else {
          that.showMsg(that.lang['message'])
        }
      });
    },
    switchLang: function (lang) {
      this.langType = lang
      this.lang = langJson[this.langType]
      this.showLangList = false
    },

    showMsg: function (msg) {
      var that = this
      if (this.timer) {
        this.MsgVisible = false
        clearTimeout(this.timer)
        this.timer = null
      }
      this.message = msg
      this.MsgVisible = true
      this.timer = setTimeout(function () {
        that.MsgVisible = false
      }, 2500)
    } 
  }
})
