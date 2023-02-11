import admin from './all/admin'
import guide from './all/guide'
import college from './all/college'
import student from './all/student'
import teacher from './all/teacher'
import helper from './all/helper'
import leader from './all/leader'

const routes = [
    ...admin,
    ...guide,
    ...college,
    ...student,
    ...teacher,
    ...helper,
    ...leader
]

export default routes