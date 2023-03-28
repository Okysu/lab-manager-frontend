<script setup lang="ts">
import { ref, onMounted } from 'vue'
import request from '@/tools/request'
import { RouterView } from "vue-router"
import Carousel from '@/components/Carousel.vue'
import Calendar from '@/components/Calendar.vue'
import { CloseOutline as CloseIcon, SearchOutline as SearchIcon, } from '@vicons/ionicons5'
const searchValue = ref("")
const showModal = ref(false)
const smallScreen = ref(false)

const handleResize = () => {
    if (window.innerWidth < 1024) {
        smallScreen.value = true
    } else {
        smallScreen.value = false
    }
}
//获取赛事信息
const contestList = ref<contest[] | null>(null)
const getAllContests = async (): Promise<contest[]> => {
    let info: contest[] = []
    await request.post('/public/contests')
        .then(function (response: any) {
            console.log(response.data)
            info = response.data.data
        })
        .catch(function (error: any) {
            console.log(error)
        })
    return info
}
//获取项目信息
const projectList = ref<project[] | null>(null)
const getAllProjects = async (): Promise<project[]> => {
    let info: project[] = []
    await request.post('/public/projects')
        .then(function (response: any) {
            console.log(response.data)
            info = response.data.data
        })
        .catch(function (error: any) {
            console.log(error)
        })
    return info
}
//获取实验室信息
const labList = ref<lab[] | null>(null)
const getAllLabs = async (): Promise<lab[]> => {
    let info: lab[] = []
    await request.post('/public/labs')
        .then(function (response: any) {
            console.log(response.data)
            info = response.data.data
        })
        .catch(function (error: any) {
            console.log(error)
        })
    return info
}
onMounted(async () => {
    window.addEventListener('resize', handleResize)
    handleResize()
    contestList.value = await getAllContests()
    projectList.value = await getAllProjects()
    labList.value = await getAllLabs()
})

</script>


<template>
    <div class="a">
        <n-layout-header class="header">
            <!-- menubar begin -->
            <nav class="navbar">
                <router-link to="/" class="nav-logo">大学生双创管理系统</router-link>
                <ul class="nav-menu">
                    <li class="nav-item">
                        <router-link to="/lab" class="nav-link">学科竞赛</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/innovation" class="nav-link">创新创业</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/honor" class="nav-link">成果荣誉</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/login" class="nav-link">用户登录</router-link>
                    </li>
                </ul>
                <div class="hamburger">
                    <span class="bar"></span>
                    <span class="bar"></span>
                    <span class="bar"></span>
                </div>
            </nav>
            <Carousel></Carousel>
        </n-layout-header>
        <div class="two_columns">
            <div class="left">
                <div>通知公告</div>
                <ul>
                    <li v-for="item in contestList">{{ item.title }}</li>
                </ul>

            </div>
            <div class="right">
                <div>活动信息</div>
                <Calendar style="height: 220px;margin-top: 50px;margin-left: 20px;"></Calendar>
            </div>
        </div>
        <div class="middle_ad">
            <img src="images/narrow-2.png" />
        </div>
        <div class="data-area">
            <div data-ani="animate__flipInX">
                <p>2019年</p>
                <p>国赛三等奖6项</p>
            </div>
            <div data-ani="animate__tada">
                <p>2020年</p>
                <p>国赛三等奖20项</p>
            </div>
            <div data-ani="animate__bounce">
                <p>2021年</p>
                <p>国赛一等奖3项<br>国赛二等奖12项<br>国赛三等奖21项</p>
            </div>
            <div data-ani="animate__swing">
                <p>2022年</p>
                <p>国赛一等奖6项<br>国赛二等奖13项<br>国赛三等奖20项</p>
            </div>
        </div>
        <div class="two_columns">
            <div class="left">
                <div>IT工程实践中心创新实验室</div>
                <n-scrollbar style="max-height: 220px">
                    <ul>
                        <li v-for="item in labList">{{ item.name }}</li>
                    </ul>
                </n-scrollbar>
            </div>
            <div class="right">
                <div>优秀大创项目</div>
                <n-scrollbar style="max-height: 220px">
                    <ul>
                        <li v-for="item in projectList">{{ item.name }}</li>
                    </ul>
                </n-scrollbar>

            </div>
        </div>
        <footer>
            <p>Copyright ©2022 常熟理工学院计算机科学与工程学院 All Rights Reserved </p>
            <p>地址:常熟市东南开发区湖山路99号 常熟理工学院东南校区 邮政编码：215500</p>
        </footer>
    </div>
</template>

<style scoped>
@import url("../css/animate.min.css");
@import url("../css/font-awesome.css");
@import url("../css/site.css");

.a {
    width: 75%;
    margin: 0 auto;
}
</style>
