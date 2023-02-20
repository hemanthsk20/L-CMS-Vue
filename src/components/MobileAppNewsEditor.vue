<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="800px">
      <v-card class="TextNews_popup">
        <v-card-title class="modaltitle">
          <span class="addapp_headline">{{ getTitle }}</span>
          <span class="closebutton" @click="closePopup">x</span>
        </v-card-title>
        <div class="language_selector">
          <div v-if="addShow">
            <v-btn-toggle
                v-for="(language, index) in languagesData"
                :key="index"
                :value="selectedLanguage"
            >
              <v-btn
                  @click="handleLanguageChange(language)"
                  :class="selectedLanguage === language ? 'active_language' : ''"
              >
                {{language}}
              </v-btn>
            </v-btn-toggle>
          </div>
        </div>
        <v-card-text class="addupdate_textnews_card">
          <div class="update_textnews_container" v-if="!addShow  && modalData.length > 0">
            <v-text-field label="Title" required v-model="getModalData.newstitle">
            </v-text-field>
            <v-textarea
              label="Body"
              outlined
              rows="8"
              row-height="25"
              v-model="getModalData.body"
            >
            </v-textarea>
          </div>
          <div class="add_textnews_container" v-if="addShow && modalData.length > 0">
            <v-text-field
              label="Title"
              required
              v-model="getModalData.newstitle"
            ></v-text-field>
            <v-textarea
              label="Body"
              outlined
              rows="8"
              row-height="25"
              v-model="getModalData.body"
            ></v-textarea>
          </div>
        </v-card-text>
        <div class="addtextnews_actions">
          <div class="MobileAppButtons">
            <v-btn class="text_overview_edit_button" text @click="handleSave()">
              Submit
            </v-btn>
            <v-btn class="text_overview_delete_button" text @click="closePopup()">
              Cancel
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from "axios";

export default {
  name: "MobileAppNewsEditor",

  props: ["show", "close", "type", "info", "appid", "languages", "submit"],
  data: () => ({
    dialog: false,
    addShow: false,
    modalData: [],
    languagesData: [],
    selectedLanguage: "",
  }),

  mounted() {
    this.languagesData = [...this.languages];
    this.selectedLanguage = this.languages[0];
    this.dialog = true;
    if (this.info === "") {
      this.addShow = true;
      let modalData = this.languagesData.map((each) => {
        return {
          language: each,
          newstitle: "",
          body: "",
        };
      });
      this.modalData = [...modalData];
    } else {
      let propsData = { ...this.info };
      this.addShow = false;
      let modalData = this.languagesData.map((each) => {
        return {
          language: each,
          newstitle: propsData.newstitle,
          body: propsData.body,
        };
      });

      this.modalData = [...modalData];
    }
  },

  watch: {
    show() {
      if (this.show === true) {
        this.dialog = true;
        if (this.info !== "") {
          this.modalData = this.info;
          this.addShow = false;
        } else {
          this.addShow = true;
        }
      } else {
        this.dialog = false;
      }
    },
  },

  updated() {},

  computed: {

    getTitle() {
      let text1 = this.type === "ADD" ? "Add App " : "Update ";
      return text1 + "News";
    },

    getModalData() {
      return this.modalData.filter(
          (each) => each.language === this.selectedLanguage
      )[0];
    },
  },

  created() {},

  methods: {
    handleValidation() {
      return true;
    },

    closePopup() {
      this.dialog = false;
      this.close();
    },

    handleLanguageChange(data) {
      this.selectedLanguage = data;
    },

    handleSave() {
      if (this.handleValidation()) {
        if (this.addShow === true) {
          let temp = this.modalData.filter(each => each.language === this.selectedLanguage)[0]
          let data = {
            appid: this.appid,
            body: temp.body,
            language: temp.language,
            newstitle: temp.newstitle,
          }
          this.handlePostApiCallAddNewsData(data);
        } else {
          let temp = this.modalData.filter(each => each.language === this.selectedLanguage)[0]
          let data = {
            appid: this.appid,
            body: temp.body,
            newstitle: temp.newstitle,
            id: this.info.id,
            language: temp.language,
          };
          this.handlePostApiCallUpdateNewsData(data, data.id);
        }
        this.dialog = false;
        this.close();
      }
    },

    handlePostApiCallAddNewsData(data) {
      if (data !== undefined) {
        return new Promise((resolve, reject) => {
          axios
              .post(
                  `https://mobile-app-cms.azure-api.net/private/appNews/`,
                  data,
                  {
                    headers: { "Ocp-Apim-Subscription-Key": "", }, //8ec096a694fa4080ba8df25a2e132205
                  }
              )
              .then((response) => {
                if (response.data.message === "SUCCESS") {
                  this.$noty.success("Data Added Successfully");
                  window.alert("Data Added Successfully");
                  this.closePopup();
                  this.submit();
                  resolve();
                }
              })
              .catch(() => {
                reject();
              });
        });
      }
    },

    handlePostApiCallUpdateNewsData(data, modalid) {
      if (data !== undefined) {
        return new Promise((resolve, reject) => {
          axios
            .post(
              `https://mobile-app-cms.azure-api.net/private/appNews/` + modalid,
              data,
              {
                headers: { "Ocp-Apim-Subscription-Key": "8ec096a694fa4080ba8df25a2e132205", },
              }
            )
            .then((response) => {
              if (response.data.message === "SUCCESS") {
                this.$noty.success("Data Updated Successfully");
                window.alert("Data Updated Successfully");
                this.closePopup();
                this.submit();
                resolve();
              }
            })
            .catch(() => {
              reject();
            });
        });
      }
    },

  },
};
</script>

<style scoped lang="scss">
@import "../style/style.scss";

.TextNews_popup {
  display: grid;
  grid-template-rows: auto auto auto;

  .modaltitle {
    display: grid;
    grid-template-columns: 1fr  1fr;
    .addapp_headline {
      font-size: 20px;
      font-family: $base-font-family;
      color: $base-black;
    }
    .closebutton {
      text-align: right;
      cursor: pointer;
    }
  }

  .language_selector {
    text-align: right;
    padding-right: 20px;
    .active_language {
      background-color: $base-color !important;
    }
  }

  .addupdate_textnews_card {
    padding: 0 20px 0 20px;
  }

  .addtextnews_actions {
    padding: 0 20px 20px 20px;
  }
}
</style>
