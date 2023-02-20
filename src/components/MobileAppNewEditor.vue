<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="800px">
      <v-card class="addapp_popup">
        <v-card-title class="modaltitle">
          <span class="addapp_headline">Add Mobile App</span>
          <span class="closebutton" @click="closePopup">x</span>
        </v-card-title>
        <v-card-text class="addapp_card">
          <div class="addapp_container">
            <v-text-field label="Name*" required v-model="modalData.name"></v-text-field>
            <v-text-field label="Division*" v-model="modalData.division"></v-text-field>
            <v-combobox
                class="language_entry"
              id="languagesElement"
              chips
              clearable
              label="Languages*"
              v-model="languages"
              multiple
              solo
              hint="Please specify languages"
              @input="handleChange"
              append-icon=""
              @formchange="handleChange"
              @forminput="handleChange"
              @change="handleChange"
            >
              <template v-slot:selection="{ attrs, item, select, selected }">
                <v-chip
                  v-bind="attrs"
                  :input-value="selected"
                  close
                  @click="select"
                  @click:close="remove(item)"
                >
                  <strong>{{ item }}</strong
                  >&nbsp;
                </v-chip>
              </template>
            </v-combobox>
            <v-text-field label="Email*" required v-model="modalData.email"></v-text-field>
            <v-text-field label="Web Page*" v-model="modalData.webpage"></v-text-field>
            <v-text-field label="Phone*" v-model="modalData.phone"></v-text-field>
            <v-text-field label="Fax*" v-model="modalData.fax"></v-text-field>
            <v-textarea
              label="Responsibility Information*"
              outlined
              rows="3"
              row-height="25"
              v-model="modalData.responsibilityinformation">
            </v-textarea>
            <v-textarea
              label="Hrd Information*"
              outlined
              rows="3"
              row-height="25"
              v-model="modalData.hrbinformation">
            </v-textarea>
          </div>
        </v-card-text>
        <v-card-actions class="MobileAppButtons">
          <v-spacer></v-spacer>
          <v-btn class="MobileAppUpdateButton" text @click="handleSave()">
            Submit
          </v-btn>
          <v-btn class="MobileAppDeleteButton" text @click="closePopup()">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from "axios";
export default {
  props: ["show", "close"],
  data: () => ({
    dialog: false,
    chip1: true,
    modalData: {
      name: "",
      division: "",
      languages: [],
      email: "",
      webpage: "",
      phone: "",
      fax: "",
      responsibilityinformation: "",
      hrbinformation: "",
    },
    languages: [],
    chips: [],
    items: [],
  }),

  mounted() {},

  watch: {
    show() {
      this.dialog = this.show === true;
    },
  },

  updated() {},

  computed: {
    handleValidation() {
      return true;
    },
  },

  created() {},

  methods: {

    handleChange(data) {
      console.log("Change", data);
    },

    closePopup() {
      this.dialog = false;
      this.modalData = {};
      this.languages = [];
      this.close();
    },

    handleSave() {
      if (this.handleValidation) {
        this.modalData.languages = this.languages;
        this.handlePostApiCall(this.modalData);
      }
    },

    handlePostApiCall(data) {
      if (data !== undefined) {
        return new Promise((resolve, reject) => {
          axios
            .post(
              `https://mobile-app-cms.azure-api.net/private/mobileApps`,
              data,
              {
                headers: {
                  "Ocp-Apim-Subscription-Key": "8ec096a694fa4080ba8df25a2e132205",
                },
              }
            )
            .then((response) => {
              if (response.data.message === "SUCCESS") {
                let postData = { ...data };
                postData.id = response.data.appid;
                this.$emit("checkSubmitNewApp", postData);
                this.closePopup();
                resolve();
              }
            })
            .catch(() => {
              reject();
            });
        });
      }
    },

    remove(item) {
      this.languages.splice(this.languages.indexOf(item), 1);
      this.languages = [...this.languages];
    },
  },
};
</script>

<style scoped lang="scss">
@import "../style/style.scss";

.addapp_popup {
  overflow: hidden;

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

  .addapp_card {
    display: grid;
    grid-template-columns: 1fr;

    .addapp_container {
      display: grid;
    }
  }
}
</style>
