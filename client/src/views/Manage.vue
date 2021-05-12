<template>
  <v-container fluid pl-0 pr-0 pb-0>
    <v-row class="pa-4">
      <v-col md="3" sm="4" cols="12">
        <v-text-field
          class="ml-2"
          v-model="search"
          label="Search"
          append-icon="mdi-magnify"
          hide-details
          clearable
          dense
          outlined
        ></v-text-field>
      </v-col>
      <v-col md="3" sm="4" cols="12">
        <v-select
          class="ml-2"
          outlined
          hide-details
          dense
          label="Featured"
          :items="featuredList"
          v-model="selectedFeatured"
        >
          <template slot="item" slot-scope="{ item }">
            {{ item.text }}
            <v-icon color="#1565c0">{{ item.icon }}</v-icon>
          </template>
        </v-select>
      </v-col>
      <v-col md="3" sm="4" cols="12">
        <v-select
          class="ml-2"
          outlined
          hide-details
          dense
          label="Status"
          :items="statusList"
          v-model="selectedStatus"
        >
          <template slot="item" slot-scope="{ item }">
            {{ item }}
            <v-icon v-if="item == 'INACTIVE'" color="error">mdi-close</v-icon>
            <v-icon v-if="item == 'ACTIVE'" color="green">mdi-check</v-icon>
          </template>
        </v-select>
      </v-col>
      <v-col md="3" sm="12">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              class="mx-2"
              dark
              color="#1565c0"
              @click="addDialog()"
            >
              ADD
              <v-icon dark> mdi-plus-circle-outline </v-icon>
            </v-btn>
          </template>
          <span>ADD </span>
        </v-tooltip></v-col
      >
    </v-row>

    <v-data-table
      :headers="headers"
      :items="computedProductItems"
      :search="search"
      dense
      :height="$vuetify.breakpoint.height - 210"
    >
      <template v-slot:[`item.ProductPhoto`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-img
              v-on="on"
              v-bind="attrs"
              :src="item.ProductPhoto"
              max-height="100"
              max-width="159"
              class="center"
            ></v-img>
          </template>

          <span>{{ item.ProductPhoto }}</span>
        </v-tooltip>
      </template>

      <template v-slot:[`item.isFeatured`]="{ item }">
        <v-icon v-if="item.isFeatured" color="#1565c0">mdi-star</v-icon>
        <v-icon v-else>mdi-star-outline</v-icon>
      </template>

      <template v-slot:[`item.DeletedDate`]="{ item }">
        <v-icon v-if="!item.DeletedDate" color="green">mdi-check</v-icon>

        <v-tooltip bottom v-else>
          <template v-slot:activator="{ on }">
            <v-icon color="red" v-on="on">mdi-close</v-icon>
          </template>

          <span>{{ item.DeletedDate }}</span>
        </v-tooltip>
      </template>

      <template v-slot:[`item.action`]="{ item }">
        <v-btn @click="editDialog(item.ProductID)" icon small color="blue">
          <v-icon>mdi-content-save-edit</v-icon>
        </v-btn>
        <v-btn
          color="red"
          icon
          small
          dark
          @click="deleteRecord(item.ProductID)"
          v-if="!item.DeletedDate"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
        <v-btn
          color="green"
          icon
          small
          dark
          @click="restoreRecord(item.ProductID)"
          v-else
        >
          <v-icon>mdi-recycle</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-card>
        <v-toolbar dense flat color="#1565c0" dark>
          <v-toolbar-title>
            {{ saveToggle }}
          </v-toolbar-title>
          <v-spacer />
          <v-icon @click="dialog = false">mdi-close</v-icon>
        </v-toolbar>
        <v-row no-gutters dense class="mt-3 pa-2">
          <v-col cols="12">
            <v-text-field
              v-model="editItems.ProductName"
              label="Name"
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="editItems.ProductDescription"
              label="Description"
              outlined
              dense
            ></v-textarea>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="editItems.ProductPhoto"
              label="Photo URL"
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row dense no-gutters class="pa-2">
          <v-checkbox
            v-model="editItems.isFeatured"
            label="Featured"
            dense
            hide-details
          ></v-checkbox>
          <v-spacer></v-spacer>
          <v-btn
            style="color: white"
            color="#1565c0"
            @click="saveRecord()"
            :disabled="loading"
            ><v-icon>mdi-content-save-move</v-icon>
            <span v-if="saveToggle == 'Add Product'">SAVE</span>
            <span v-else>UPDATE</span>
          </v-btn>
        </v-row>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
import Swal from "sweetalert2";

export default {
  name: "Product",
  data() {
    return {
      loading: false,
      search: "",
      headers: [
        { text: "Photo", value: "ProductPhoto", align: "center", width: "10%" },
        { text: "Name", value: "ProductName", align: "center", width: "25%" },
        {
          text: "Description",
          value: "ProductDescription",
          align: "center",
          width: "25%",
        },
        {
          text: "Featured",
          value: "isFeatured",
          align: "center",
          width: "10%",
        },
        { text: "Status", value: "DeletedDate", align: "center" },
        { text: "", value: "action" },
      ],
      productItems: [],
      dialog: false,
      editItems: {},
      saveToggle: "",

      statusList: ["ALL", "ACTIVE", "INACTIVE"],
      selectedStatus: "ALL",

      // featuredList: ["ALL", "FEATURED", "NOT FEATURED"],
      featuredList: [
        { text: "ALL", icon: "" },
        { text: "FEATURED", icon: "mdi-star" },
        { text: "NOT FEATURED", icon: "mdi-star-outline" },
      ],
      selectedFeatured: "ALL",
    };
  },

  created() {
    this.getRecord();
  },

  mounted() {},

  methods: {
    getRecord() {
      let url = `${this.api}get/Product`;
      axios.get(url).then((res) => {
        this.productItems = res.data;
      });
    },

    addDialog() {
      this.saveToggle = "Add Product";
      this.dialog = true;
      this.editItems = {};
    },

    editDialog(index) {
      const newIndex = index - 1;
      this.saveToggle = "Edit Product";
      this.dialog = true;
      this.editItems = { ...this.productItems[newIndex] };
    },

    deleteRecord(index) {
      let url = `${this.api}delete/Product/${index}/${this.updatedBy}`;
      axios.post(url).then(() => {
        this.getRecord();
      });
    },

    restoreRecord(index) {
      let url = `${this.api}restore/Product/${index}/${this.updatedBy}`;
      axios.post(url).then(() => {
        this.getRecord();
      });
    },

    saveRecord() {
      if (!this.editItems.ProductName) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Please insert Product Name !",
          showConfirmButton: false,
          timer: 800,
        });
        return;
      }

      if (!this.editItems.ProductDescription) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Please insert Description !",
          showConfirmButton: false,
          timer: 800,
        });
        return;
      }

      if (!this.editItems.ProductPhoto) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Please insert image url !",
          showConfirmButton: false,
          timer: 800,
        });
        return;
      }

      // if (!this.editItems.ProductPhoto.match(/.(jpg|jpeg|png|gif)$/i)) {
      //   Swal.fire({
      //     position: "center",
      //     icon: "error",
      //     title: "Invalid Image extension !",
      //     showConfirmButton: false,
      //     timer: 800,
      //   });
      //   return;
      // }

      this.editItems.UpdatedBy = this.updatedBy;

      if (this.editItems.isFeatured) {
        this.editItems.isFeatured = 1;
      } else {
        this.editItems.isFeatured = 0;
      }
      if (this.saveToggle == "Add Product") {
        this.loading = true;
        let url = `${this.api}add/Product`;
        axios.post(url, this.editItems).then(() => {
          this.loading = false;
          this.dialog = false;
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Success !",
            showConfirmButton: false,
            timer: 800,
          });
          this.getRecord();
        });
      } else {
        this.loading = true;
        let url = `${this.api}update/Product`;
        axios.post(url, this.editItems).then(() => {
          this.loading = false;
          this.dialog = false;
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Success !",
            showConfirmButton: false,
            timer: 800,
          });
          this.getRecord();
        });
      }
    },
  },
  computed: {
    computedProductItems() {
      return this.productItems
        .filter((rec) => {
          if (this.selectedStatus == "ALL") {
            return rec;
          } else if (this.selectedStatus == "ACTIVE") {
            return !rec.DeletedDate;
          } else {
            return rec.DeletedDate;
          }
        })
        .filter((rec) => {
          if (this.selectedFeatured == "ALL") {
            return rec;
          } else if (this.selectedFeatured == "FEATURED") {
            return rec.isFeatured;
          } else {
            return !rec.isFeatured;
          }
        });
    },
  },
};
</script>

<style>
</style>
