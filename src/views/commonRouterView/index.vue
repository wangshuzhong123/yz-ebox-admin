<!--公用路由显示容器二级父菜单-->
<template>
  <transition name="fade" mode="out-in">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </transition>
</template>