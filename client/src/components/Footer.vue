<template>
  <v-footer color="primary lighten-1" padless absolute>
    <v-row justify="center" no-gutters>
      <v-row justify="center" >
        <v-list v-for="(item, i) in icons" :key="i" color="transparent">
          <v-list-item :href="item.href">
            <v-icon  color="white">{{ item.icon }}</v-icon>
          </v-list-item> 
        </v-list>
      </v-row>
      <v-col class="primary lighten-2 py-4 text-center white--text" cols="12">
        {{ new Date().getFullYear() }} — <strong>Awesome Lab Inc.</strong>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
export default {
  name: "Home",

  data: () => ({
    pageList: [
      { title: "Home", icon: "mdi-home", routes: "/" },
      { title: "Manage", icon: "mdi-basket", routes: "/manage" },
    ],
    icons: [
      {
        icon: "mdi-facebook",
        href: "https://facebook.com/charleskieeeee",
        target: "_blank",
      },
      {
        icon: "mdi-linkedin",
        href: "https://www.linkedin.com/in/charles-kenneth-labit-731a941b2/",
        target: "_blank",
      },
      {
        icon: "mdi-github",
        href: "https://github.com/charleslabit",
        target: "_blank",
      },
    ],
  }),
};
</script>
