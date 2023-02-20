<template>
  <div v-if="id !== null" class="MobileTextOverview">
    <div class="mobile_text_overview_heading">
      <div>Text</div>
      <div class="MobileAppButtons">
        <v-btn
          class="MobileAppUpdateButton"
          @click="handleAddUpdate('ADD')"
          >Add App Text</v-btn
        >
      </div>
    </div>

    <div class="TextTable">
      <div class="TextTableHead">
        <div class="TableDragHandle">#</div>
        <div class="TextTableTitle">Title</div>
        <div class="TextTableActions">Actions</div>
      </div>
      <div class="TextTableBody" v-for="(item, i) in getMobileData" :key="i">
        <div class="TableBodyDragHandle">#</div>
        <div class="TextTableBodyTitle">{{ item.title.de }}</div>
        <div class="TextTableBodyActions">
          <div class="MobileAppButtons">
            <v-btn class="MobileAppUpdateButton" @click="handleUpdate(item)">
              <v-icon class="fas fa-pencil-alt"></v-icon>
              Edit
            </v-btn>
            <v-btn
                class="MobileAppDeleteButton"
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
    <MobileAppTextEditor
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
import MobileAppTextEditor from "@/components/MobileAppTextEditor";

export default {
  props: ["MobileId", "languages"],
  name: "MobileAppTextOverview",
  components: {
    MobileAppTextEditor,
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
      return this.mobileData
          .filter((each) => each.page === this.currentpageNo)
          .sort((a, b) =>
              a.title.de.toLowerCase() > b.title.de.toLowerCase() ? 1 : -1
          );
    },
  },

  created() {},

  methods: {
    apiCall(id) {
      axios
        .get(
          `https://mobile-app-cms.azure-api.net/private/appTextsByAppId/${id}`,
          {
            headers: {
              "Ocp-Apim-Subscription-Key": "8ec096a694fa4080ba8df25a2e132205",
            },
          }
        )
        .then((response) => {
          this.mobileData = response.data;
          let mobileLength = response.data.length;
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
          `https://mobile-app-cms.azure-api.net/private/appTexts/${appid}/${id}`,
          {
            headers: {
              "Ocp-Apim-Subscription-Key": "", //8ec096a694fa4080ba8df25a2e132205
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

    handleDelete(data) {
      let confirm = window.confirm(
        "Are you sure you want to delete this item?"
      );
      if (confirm) {
        this.apiCallDelete(data.appid, data.id);
      }
    },

    handleCloseAddNew() {
      this.showAddUpdatePopup = false;
    },

    handleSubmitPopup() {
      this.apiCall(this.id);
    },
  },
};
</script>

<style scoped lang="scss">
@import "../style/style.scss";

.MobileTextOverview {
  display: grid;
  grid-template-rows: auto auto;
  margin-top: 50px;
  padding: 10px 10px 10px 0;
  border-top: 0.1px solid rgba(0, 0, 0, 0.12);

  .mobile_text_overview_heading {
    display: grid;
    grid-template-columns: auto auto;
    grid-gap: 0;
    font-family: $base-font-family;
    font-size: 16px;
    margin-bottom: 20px;
    font-weight: 700;
  }

  .TextTable {
    display: grid;
    position: -webkit-sticky;
    box-shadow: 0 2px 1px -1px rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 1px 3px 0 rgba(0,0,0,.12)!important;

    .TextTableHead {
      display: grid;
      grid-template-columns: 1fr 3fr 2fr;

      .TableDragHandle {
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
      .TextTableTitle {
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
      .TextTableActions {
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

    .TextTableBody {
      display: grid;
      grid-template-columns: 1fr 3fr 2fr;

      .TableBodyDragHandle {
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
      .TextTableBodyTitle {
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
      .TextTableBodyActions {
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
