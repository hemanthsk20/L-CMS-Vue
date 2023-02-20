<template>
  <div v-if="id !== null" class="MobileNewsOverview">
    <div class="mobile_news_overview_heading">
      <div>News</div>
      <div class="MobileAppButtons">
        <v-btn
            class="MobileAppUpdateButton"
            @click="handleAddUpdate('ADD')"
        >Add App News</v-btn
        >
      </div>
    </div>
    <div class="NewsTable">
      <div class="NewsTableHead">
        <div class="NewsTableDragHandle">News Title</div>
        <div class="NewsTableTitle">Language</div>
        <div class="NewsTableActions">Actions</div>
      </div>
      <div class="NewsTableBody" v-for="(item, i) in getMobileData" :key="i">
        <div class="NewsTableBodyDragHandle">{{ item.newstitle }}</div>
        <div class="NewsTableBodyTitle">{{ item.language }}</div>
        <div class="NewsTableBodyActions">
          <div class="MobileAppButtons">
            <v-btn class="MobileAppUpdateButton" @click="handleUpdate(item)">
              <v-icon class="fas fa-pencil-alt"></v-icon>
              Edit
            </v-btn>
            <v-btn class="MobileAppDeleteButton"
                   @click="handleDelete(item)"
            >
              <v-icon class="fas fa-trash-alt"></v-icon>
              Delete
            </v-btn>
          </div>
        </div>
      </div>
      <div class="text-center" v-if="mobileData.length > eachPage">
        <v-pagination v-model="currentpageNo" :length="pageLength"></v-pagination>
      </div>
    </div>
    <MobileAppNewsEditor
        v-if="showAddUpdatePopup"
        :type="type"
        :show="showAddUpdatePopup"
        :close="handleCloseAddNew"
        :submit="handleSubmitPopup"
        :info="selected"
        :appid="id"
        :languages="languagesData"
    />
  </div>
</template>

<script>
import axios from "axios";
import MobileAppNewsEditor from "@/components/MobileAppNewsEditor";

export default {
  props: ["MobileId", "languages"],
  name: "MobileAppNewsOverview",
  components: {
    MobileAppNewsEditor,
  },

  data: () => ({
    mobileData: [],
    id: null,
    currentPage: "Update",
    showAddUpdatePopup: false,
    type: "",
    selected: "",
    languagesData: [],
    currentpageNo: 1,
    pageLength: 1,
    eachPage: 5,
  }),

  mounted() {
    this.id = this.MobileId;
    this.apiCall(this.id);
    this.languagesData = [...this.languages];
  },

  watch: {
    MobileId() {
      if (this.MobileId !== undefined) {
        this.mobileData = [];
        this.id = this.MobileId;
        this.apiCall(this.id);
      } else {
        this.id = null;
        this.mobileData = [];
      }
    },

    languages() {
      this.languagesData = this.languages;
    },
  },

  updated() {},

  computed: {
    getMobileData() {
      if (this.mobileData.length > 0) {
        return this.mobileData
            .filter((each) => each.page === this.currentpageNo)
            .sort((a, b) =>
                a.newstitle.toLowerCase() > b.newstitle.toLowerCase() ? 1 : -1
            );
      } else {
        return [];
      }
    },
  },

  created() {},

  methods: {
    apiCall(id) {
      axios
          .get(
              `https://mobile-app-cms.azure-api.net/private/appNews/${id}/10/1`,
              {
                headers: {
                  "Ocp-Apim-Subscription-Key": "", //8ec096a694fa4080ba8df25a2e132205
                },
              }
          )
          .then((response) => {
            this.mobileData =
                response.data.response !== undefined ? response.data.response : [];
            let mobileLength = this.mobileData.length;
            this.pageLength = Math.ceil(mobileLength / this.eachPage);
            let count = 1;
            let tempCount = 0;
            let temp = [...this.mobileData];
            for (let i = 0; i < mobileLength; i++) {
              if (tempCount === this.eachPage) {
                count++;
                tempCount = 0;
              }
              temp[i]["page"] = count;
              tempCount++;
            }
            this.mobileData = [...temp];
          })
          .catch(() => {});
    },

    apiCallDelete(appid, id) {
      axios
          .delete(
              `https://mobile-app-cms.azure-api.net/private/appNews/${appid}/${id}`,
              {
                headers: {
                  "Ocp-Apim-Subscription-Key": "8ec096a694fa4080ba8df25a2e132205",
                },
              }
          )
          .then((response) => {
            if (response.data.message === "SUCCESS") {
              this.$noty.success("Data deleted Successfully");
              window.alert("Data deleted Successfully");
              this.apiCall(this.id);
            }
          })
          .catch(() => {});
    },

    handleBack(data) {
      if (data === "Update") {
        this.$emit("checkPrevious", this.currentPage);
      }
    },

    handleAddUpdate(Data) {
      this.showAddUpdatePopup = true;
      this.type = Data;
      this.selected = "";
    },

    handleUpdate(data) {
      this.selected = data;
      this.type = "UPDATE";
      this.showAddUpdatePopup = true;
    },

    handleCloseAddNew() {
      this.showAddUpdatePopup = false;
    },

    handleSubmitPopup() {
      this.apiCall(this.id);
    },

    handleDelete(data) {
      let confirm = window.confirm(
          "Are you sure you want to delete this item?"
      );
      if (confirm) {
        this.apiCallDelete(data.appid, data.id);
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "../style/style.scss";

.MobileNewsOverview {
  display: grid;
  grid-template-rows: auto auto;
  margin-top: 50px;
  padding: 10px 10px 10px 0;
  border-top: 0.1px solid rgba(0, 0, 0, 0.12);

  .mobile_news_overview_heading {
    display: grid;
    grid-template-columns: auto auto;
    grid-gap: 0;
    font-family: $base-font-family;
    font-size: 16px;
    margin-bottom: 20px;
    font-weight: 700;
  }

  .NewsTable {
    display: grid;
    position: -webkit-sticky;
    box-shadow: 0 2px 1px -1px rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 1px 3px 0 rgba(0,0,0,.12)!important;
    border-left: 0.1px solid rgba(0, 0, 0, 0.12);
    border-right: 0.1px solid rgba(0, 0, 0, 0.12);

    .NewsTableHead {
      display: grid;
      grid-template-columns: 2fr 1fr 2fr;

      .NewsTableDragHandle {
        color: rgba(0, 0, 0, 0.6);
        background-color: white;
        font-size: 16px;
        font-family: $base-font-family;
        font-weight: 700;
        padding: 8px;
        border-left: 0.1px solid rgba(0, 0, 0, 0.12);
        border-bottom: 0.1px solid rgba(0, 0, 0, 0.12);
        border-top: 0.1px solid rgba(0, 0, 0, 0.12);
        text-align: left;
      }
      .NewsTableTitle {
        color: rgba(0, 0, 0, 0.6);
        background-color: white;
        font-size: 16px;
        font-family: $base-font-family;
        font-weight: 700;
        padding: 8px;
        border-bottom: 0.1px solid rgba(0, 0, 0, 0.12);
        border-top: 0.1px solid rgba(0, 0, 0, 0.12);
        text-align: left;
      }
      .NewsTableActions {
        color: rgba(0, 0, 0, 0.6);
        background-color: white;
        font-size: 16px;
        font-family: $base-font-family;
        font-weight: 700;
        padding: 8px;
        border-right: 0.1px solid rgba(0, 0, 0, 0.12);
        border-bottom: 0.1px solid rgba(0, 0, 0, 0.12);
        border-top: 0.1px solid rgba(0, 0, 0, 0.12);
        text-align: right;
      }
    }

    .NewsTableBody {
      display: grid;
      grid-template-columns: 2fr 1fr 2fr;

      .NewsTableBodyDragHandle {
        color: rgba(0, 0, 0, 0.6);
        background-color: white;
        font-size: 14px;
        font-family: $base-font-family;
        font-weight: normal;
        padding: 8px;
        border-left: 0.1px solid rgba(0, 0, 0, 0.12);
        border-bottom: 0.1px solid rgba(0, 0, 0, 0.12);
        text-align: left;
        height: 40px;
      }
      .NewsTableBodyTitle {
        color: rgba(0, 0, 0, 0.6);
        background-color: white;
        font-size: 14px;
        font-family: $base-font-family;
        font-weight: normal;
        padding: 8px;
        border-bottom: 0.1px solid rgba(0, 0, 0, 0.12);
        text-align: left;
        height: 40px;
      }
      .NewsTableBodyActions {
        color: rgba(0, 0, 0, 0.6);
        background-color: white;
        font-size: 14px;
        font-family: $base-font-family;
        font-weight: normal;
        padding: 8px;
        border-right: 0.1px solid rgba(0, 0, 0, 0.12);
        border-bottom: 0.1px solid rgba(0, 0, 0, 0.12);
        text-align: right;
        height: 40px;
      }
    }
    .text-center {
      display: grid;
      justify-content: right;
    }
  }
}
</style>
