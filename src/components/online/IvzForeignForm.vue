<template>
    <div>
        <a-button type="primary" @click="showModal">编辑外键 ({{foreign.length}})</a-button>
        <a-modal v-model="visible" okText="确定" :closable="false"
                 @ok="handleOk" :footer="null" :width="820" :bodyStyle="{padding: '12px'}">
            <div slot="title" style="text-align: center">
                <span>外键列表</span>
                <a-button style="margin-left: 16px" type="primary" size="small"
                          shape="circle" @click="rowHandle('', 1)">+</a-button>
            </div>
            <a-row v-for="(item, index) in foreign" :gutter="6" :key="index" style="margin: 3px">
                <a-col :span="9">
                  外键
                  <a-select v-model="item.foreign" style="width: 110px">
                    <a-select-option v-for="meta in formMetas" :key="meta.id"
                      :value="meta.model.name">{{meta.model.name}}</a-select-option>
                  </a-select>
                  <a-cascader style="width: 148px" :options="options" @change="changeHandle(item)"
                      :load-data="loadData" v-model="item.key" placeholder="请选择外键表"  />
                </a-col>
                <a-col :span="9">更新
                  <a-select v-model="item.update" style="width: 98px">
                    <a-select-option value="-1">不设置</a-select-option>
                    <a-select-option value="1">no action</a-select-option>
                    <a-select-option value="2">restrict</a-select-option>
                    <a-select-option value="3">set null</a-select-option>
                    <a-select-option value="4">set default</a-select-option>
                    <a-select-option value="5">cascade</a-select-option>
                  </a-select>删除
                  <a-select v-model="item.delete" style="width: 98px">
                    <a-select-option value="-1">不设置</a-select-option>
                    <a-select-option value="1">no action</a-select-option>
                    <a-select-option value="2">restrict</a-select-option>
                    <a-select-option value="3">set null</a-select-option>
                    <a-select-option value="4">set default</a-select-option>
                    <a-select-option value="5">cascade</a-select-option>
                  </a-select>
                </a-col>
                <a-col :span="6">
                    <a-radio-group button-style="solid" v-model="item.type">
                        <a-radio-button value="one">
                            一对一
                        </a-radio-button>
                        <a-radio-button value="many">
                            一对多
                        </a-radio-button>
                    </a-radio-group>
                  <a-button type="danger" size="small"
                        shape="circle" @click="rowHandle(index, 2)">--</a-button>
                </a-col>
            </a-row>
        </a-modal>
    </div>
</template>
<!--外键组件-->
<script>
    import Preview from './preview.data'
    export default {
        name: "IvzForeignForm",
        props: ['meta', 'model', 'global', "formMetas"],
        data() {
            return {
                count: 0,
                visible: false,
                options: [],
                foreign: [],
                optionsMap: {},
                selectedForeign: null,
            }
        },
        created() {
            this.foreign = this.global.foreign;
            this.selectedForeign = this.global.selectedForeign;
            this.$http.get(Preview.getConfig('foreignUrl')).then(resp=>{
                this.options = resp.data;
                this.options.forEach(item => {
                  this.optionsMap[item.value] = item;
                })
            });
        },
        methods: {
            showModal() {
                this.visible = true;
            },
            handleOk() {
                this.visible = false;
            },
            rowHandle(item, type) {
                if(type == 1) {
                  this.foreign.push({type: 'one', key: [], update: '-1', delete: '-1', foreign: null})
                } else {
                  let element = this.foreign[item];
                  this.foreign.splice(item, 1);
                  this.selectedForeign.forEach((foreign, index) => {
                      if(element.key[0] == foreign.value) {
                        this.selectedForeign.splice(index, 1);
                      }
                  })
                }
            },
            changeHandle(item) {
                if(this.foreign.length > 0) {
                   for(let meta of this.foreign) {
                     if(meta == item) {
                       continue;
                     } else {
                       if(item.key.length == 2 && meta.key.length ==2) {
                         if(meta.key[0] == item.key[0]) {
                           if(meta.key[1] == item.key[1]) {
                             item.key.length = 0;
                             return this.$msg.warningMessage("已经包含此外键")
                           }
                         }
                       }
                     }
                   }
                   let element = this.optionsMap[item.key[0]];
                   this.selectedForeign.push(element);
                } else {
                    let element = this.optionsMap[item.key[0]];
                    this.selectedForeign.push(element);
                }
            },
            loadData(selected) {

            }
        }
    }
</script>

<style scoped>

</style>
