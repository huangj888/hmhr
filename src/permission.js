import router from './router'

// const whiteList = ['/login']

router.beforeEach(async(to, from, next) => {
  next()
})

router.afterEach(() => {

})
