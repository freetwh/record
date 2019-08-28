// components/note/note.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    note: {
      type: Object,
      value: null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  attached: function () { 
    console.log(this.properties)
  }, 
  /**
   * 组件的方法列表
   */
  methods: {
  }
})
