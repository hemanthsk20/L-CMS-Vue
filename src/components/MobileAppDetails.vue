<template>
  <div>
    <div v-if="id !== null" class="MobileAppEditor">
      <div class="mobile_details_heading">
        <span>Update Mobile App</span>
        <router-link v-bind:to="'/'"
        ><div @click="handleBack(currentPage)">
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path
                fill="currentColor"
                d="M2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12M18,11H10L13.5,7.5L12.08,6.08L6.16,12L12.08,17.92L13.5,16.5L10,13H18V11Z"
            />
          </svg></div
        ></router-link></div>
      <div v-if="currentPage === 'Update'" class="fieldsContainer">
        <div>
          <v-text-field label="Name" v-model="mobileData.name"></v-text-field>
          <v-text-field
            label="Division"
            v-model="mobileData.division"
            disabled
          ></v-text-field>
          <v-combobox multiple
                      v-model="mobileData.languages"
                      label="Languages"
                      append-icon
                      chips
                      deletable-chips
                      class="tag-input">
          </v-combobox>
        </div>
        <div>
          <v-text-field label="Email" v-model="mobileData.email"></v-text-field>
          <v-text-field
            label="Webpage"
            v-model="mobileData.webpage"
          ></v-text-field>
          <v-text-field label="Phone" v-model="mobileData.phone"></v-text-field>
          <v-text-field label="Fax" v-model="mobileData.fax"></v-text-field>
        </div>
        <div>
          <v-textarea
            label="Responsibility Information"
            outlined
            rows="3"
            row-height="25"
            v-model="mobileData.responsibilityinformation"
          >
          </v-textarea>
          <v-textarea
            label="Hrd Information"
            outlined
            rows="3"
            row-height="25"
            v-model="mobileData.hrbinformation"
          >
          </v-textarea>
        </div>

      </div>
      <div class="MobileAppButtons">
        <v-btn v-if="currentPage === 'Update'" class="MobileAppUpdateButton"
               @click="handleUpdate(mobileData)"
          >
          <v-icon class="fas fa-pencil-alt"></v-icon>
          Update
        </v-btn
        >
        <v-btn v-if="currentPage === 'Update'" class="MobileAppDeleteButton"
               @click="handleDelete(mobileData)"
          >
          <v-icon class="fas fa-trash-alt"></v-icon>
          Delete
        </v-btn
        >
      </div>
    </div>
    <MobileAppTextOverview
      v-if="id"
      :MobileId="id"
      :languages="languages"
    ></MobileAppTextOverview>
    <MobileAppNewsOverview
      v-if="id"
      :MobileId="id"
      :languages="languages"
    ></MobileAppNewsOverview>
    <div :class="loading === true ? 'loading style-2' : ''">
      <div class="loading-wheel"></div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import MobileAppNewsOverview from "@/components/MobileAppNewsOverview";
import MobileAppTextOverview from "@/components/MobileAppTextOverview";
import {eventBus} from "@/main";

export default {
  props: ["MobileId"],
  components: {
    MobileAppTextOverview,
    MobileAppNewsOverview,
  },

  data: () => ({
    mobileData: {},
    id: null,
    currentPage: "Update",
    languages: [],
    loading: false,
  }),

  mounted() {
    this.id = this.getId;
    this.apiCall(this.id);
  },

  watch: {

    getId() {
      if (this.getId !== undefined) {
        this.mobileData = {};
        this.id = this.getId;
        this.apiCall(this.getId);
      } else {
        this.id = null;
        this.mobileData = {};
      }
    },

  },

  updated() {},

  computed: {
    getId() {
      return this.$route.params.id;
    },
  },

  created() {
    this.mobileData = {};
    this.apiCall(this.getId);
  },

  methods: {

    handleUpdate(data) {
      if (data !== undefined) {
        this.handlePostApiCallUpdateAppData(data);
      }
    },

    handlePostApiCallUpdateAppData(data) {
      if (data !== undefined) {
        return new Promise((resolve, reject) => {
          axios
              .post(
                  `https://mobile-app-cms.azure-api.net/private/mobileApps/` + data.id,
                  data,
                  {
                    headers: { "Ocp-Apim-Subscription-Key": "", }, //8ec096a694fa4080ba8df25a2e132205
                  }
              )
              .then((response) => {
                if (response.data.message === "SUCCESS") {
                  this.$noty.success("Data Added Successfully");
                  window.alert("Data Added Successfully");
                  resolve();
                }
              })
              .catch(() => {
                reject();
              });
        });
      }
    },

    handleDelete(data) {
      let confirm = window.confirm(
          "Are you sure you want to delete this item?"
      );
      if (confirm) {
        this.apiCallDelete(data.id);
      }
    },

    apiCallDelete(id) {
      axios
          .delete(
              `https://mobile-app-cms.azure-api.net/private/mobileApps/${id}`,
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
              eventBus.$emit("deletedApp");
            }
          })
          .catch(() => {});
    },

    remove(item) {
      this.languages.splice(this.languages.indexOf(item), 1);
      this.languages = [...this.languages];
    },

    apiCall(id) {
      if (id !== undefined) {
        this.loading = true;
        axios
          .get(
            `https://mobile-app-cms.azure-api.net/private/mobileApps/${id}`,
            {
              headers: {
                "Ocp-Apim-Subscription-Key": "8ec096a694fa4080ba8df25a2e132205",
              },
            }
          )
          .then((response) => {
            this.mobileData = response.data;
            this.languages = [...response.data.languages];
            this.loading = false;
          })
          .catch(() => {});
      }
    },

    handleBack(data) {
      if (data === "Update") {
        this.$emit("checkPrevious", this.currentPage);
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "../style/style.scss";

.MobileAppEditor {
  .mobile_details_heading {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-bottom: 1rem;
    font-family: $base-font-family;
    font-size: 16px;
    font-weight: 700;
    a {
      text-align:right;
    }
    .router-link-active {
      color: $base-color
    }
  }

  .fieldsContainer {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 1rem;
  }
}

// styling for loader
.loading {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0,0,0,.5);
  z-index: 20;
}
.loading-wheel {
  width: 20px;
  height: 20px;
  margin-top: -40px;
  margin-left: -40px;
  position: absolute;
  top: 50%;
  left: 50%;
  border-width: 30px;
  border-radius: 50%;
  -webkit-animation: spin 1s linear infinite;
}
.style-2 .loading-wheel {
  border-style: double;
  border-color: #ccc transparent;
}
@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0);
  }
  100% {
    -webkit-transform: rotate(-360deg);
  }
}
</style>
