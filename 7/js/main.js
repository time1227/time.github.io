// ==================== 1. 基础默认数据 & 本地存储封装 ====================
const defaultData = {
	mainCategory: [{
			id: 1,
			name: '宝宝点菜专区',
			open: true
		},
		{
			id: 2,
			name: '日常报备',
			open: false
		},
		{
			id: 3,
			name: '爱意互动',
			open: false
		},
		{
			id: 4,
			name: '专属服务',
			open: false
		},
	],
	subCategory: [
		// 日常报备 parentId=2
		{
			id: 201,
			parentId: 2,
			name: '出门报备',
			cid: 3
		},
		{
			id: 202,
			parentId: 2,
			name: '到家报平安',
			cid: 3
		},
		// 爱意互动 parentId=3
		{
			id: 101,
			parentId: 3,
			name: '哄睡觉',
			cid: 2
		},
		{
			id: 102,
			parentId: 3,
			name: '亲亲我',
			cid: 2
		},
		{
			id: 103,
			parentId: 3,
			name: '要抱抱',
			cid: 2
		},
		{
			id: 104,
			parentId: 3,
			name: '要摸摸',
			cid: 1
		},
		{
			id: 301,
			parentId: 3,
			name: '说情话',
			cid: 4
		},
		// 专属服务 parentId=4
		{
			id: 401,
			parentId: 4,
			name: '捶背按摩',
			cid: 5
		},
		{
			id: 402,
			parentId: 4,
			name: '哄我开心',
			cid: 6
		},
		{
			id: 403,
			parentId: 4,
			name: '哄宝贝入睡',
			cid: 7
		},
	],
	dish: [{
			id: 1,
			cid: 2,
			name: '哄睡觉',
			img: './img/sleep.jpg',
			star: 5,
			price: 0,
			stock: 996,
			sales: 0
		},
		{
			id: 2,
			cid: 2,
			name: '亲亲我',
			img: './img/kisss.jpg',
			star: 5,
			price: 0,
			stock: 994,
			sales: 0
		},
		{
			id: 3,
			cid: 2,
			name: '要抱抱',
			img: './img/hug.jpg',
			star: 5,
			price: 0,
			stock: 997,
			sales: 0
		},
		{
			id: 4,
			cid: 1,
			name: '要摸摸',
			img: './img/hug.jpg',
			star: 5,
			price: 0,
			stock: 997,
			sales: 0
		},
		{
			id: 5,
			cid: 3,
			name: '出门报备',
			img: './img/sleep.jpg',
			star: 5,
			price: 0,
			stock: 999,
			sales: 0
		},
		{
			id: 6,
			cid: 3,
			name: '到家报平安',
			img: './img/kisss.jpg',
			star: 5,
			price: 0,
			stock: 999,
			sales: 0
		},
		{
			id: 7,
			cid: 4,
			name: '说情话',
			img: './img/praise.jpg',
			star: 5,
			price: 10,
			stock: 998,
			sales: 0
		},
		{
			id: 8,
			cid: 5,
			name: '捶背按摩',
			img: './img/sleep.jpg',
			star: 5,
			price: 20,
			stock: 995,
			sales: 0
		},
		{
			id: 9,
			cid: 6,
			name: '哄我开心',
			img: './img/kisss.jpg',
			star: 5,
			price: 15,
			stock: 996,
			sales: 0
		},
		{
			id: 10,
			cid: 7,
			name: '哄宝贝入睡',
			img: './img/sleep.jpg',
			star: 5,
			price: 0,
			stock: 999,
			sales: 0
		},
	],
	cart: [],
	order: [],
	activeCid: 2
}

// 本地存储工具
const DB = {
	get() {
		const local = localStorage.getItem('coupleOrderData')
		return local ? JSON.parse(local) : defaultData
	},
	set(data) {
		localStorage.setItem('coupleOrderData', JSON.stringify(data))
	}
}
let store = DB.get()

// ==================== 2. 页面渲染函数模块 ====================
/**
 * 渲染左侧树形分类栏
 */
function renderCategory() {
	const wrap = document.getElementById('categoryList')
	let html = ''
	if (!store || !Array.isArray(store.mainCategory)) {
		wrap.innerHTML = ''
		return
	}

	store.mainCategory.forEach(mainItem => {
		const childList = Array.isArray(store.subCategory) ? store.subCategory.filter(sub => sub.parentId ===
			mainItem.id) : []
		html += `
      <div data-mid="${mainItem.id}" class="main-item px-4 py-3 font-bold cursor-pointer flex justify-between items-center border-b bg-gray-50">
        <span>${mainItem.name}</span>
        <i class="fa fa-angle-${mainItem.open ? 'down' : 'right'} text-gray-400"></i>
      </div>
      <div class="child-wrap ${mainItem.open ? '' : 'hidden'}">
        ${childList.map(subItem => {
          const isActive = store.activeCid === subItem.cid
          const isPink = subItem.cid === 3 || subItem.cid === 4
          let cls = "sub-item px-6 py-2 cursor-pointer block w-full"
          if(isActive) cls += isPink ? " side-active-pink" : " side-active"
          return '<div data-cid="' + subItem.cid + '" class="' + cls + '">' + subItem.name + '</div>'
        }).join('')}
      </div>
    `
	})
	wrap.innerHTML = html

	// 一级分类折叠展开
	document.querySelectorAll('.main-item').forEach(el => {
		el.onclick = () => {
			const mid = Number(el.dataset.mid)
			const target = store.mainCategory.find(m => m.id === mid)
			target.open = !target.open
			DB.set(store)
			renderCategory()
		}
	})

	// 子分类切换菜品
	document.querySelectorAll('.sub-item').forEach(el => {
		el.onclick = () => {
			store.activeCid = Number(el.dataset.cid)
			DB.set(store)
			renderCategory()
			renderDish()
		}
	})
}

/**
 * 渲染右侧菜品网格列表
 */
function renderDish() {
	const wrap = document.getElementById('dishWrap')
	const list = store.dish.filter(d => d.cid === store.activeCid)
	document.getElementById('totalDish').textContent = store.dish.length

	if (list.length === 0) {
		wrap.innerHTML =
			`<div class="w-full h-40 flex items-center justify-center text-gray-400 text-lg">当前分类还没有菜品哦</div>`
		return
	}

	wrap.innerHTML = list.map(item => {
		let starHtml = ''
		for (let i = 0; i < 5; i++) starHtml += `<i class="fa fa-star star-fill"></i>`
		return `
      <div class="bg-white rounded-xl shadow p-3 flex gap-3">
        <img src="${item.img}" class="w-24 h-24 rounded-lg object-cover shrink-0">
        <div class="flex-1 flex flex-col justify-between">
          <div>
            <h4 class="font-bold text-lg">${item.name}</h4>
            <div class="my-1">${starHtml}</div>
            <div class="text-sm text-gray-500">菜币：${item.price} | 库存${item.stock} | 销量${item.sales}</div>
          </div>
          <div class="flex justify-end">
            <button data-did="${item.id}" class="add-cart w-8 h-8 rounded-full bg-main text-white">+</button>
          </div>
        </div>
      </div>
    `
	}).join('')

	// 加购按钮事件
	document.querySelectorAll('.add-cart').forEach(btn => {
		btn.onclick = () => {
			const did = Number(btn.dataset.did)
			const targetDish = store.dish.find(d => d.id === did)
			const cartItem = store.cart.find(c => c.did === did)
			if (cartItem) cartItem.num += 1
			else store.cart.push({
				did,
				num: 1
			})
			DB.set(store)
			renderCartNum()
		}
	})
}

/**
 * 更新购物车顶部数字
 */
function renderCartNum() {
	const total = store.cart.reduce((sum, cur) => sum + cur.num, 0)
	document.getElementById('cartNum').textContent = total
	document.getElementById('submitOrderBtn').disabled = total === 0
}

// ==================== 3. 弹窗交互模块 ====================
// 3.1 购物车弹窗
document.querySelector('.fa-shopping-cart').parentElement.onclick = function() {
	const mask = document.getElementById('mask')
	const cartWrap = document.getElementById('cartList')
	if (store.cart.length === 0) {
		cartWrap.innerHTML = '<p class="text-center text-gray-400">购物车空空如也</p>'
	} else {
		cartWrap.innerHTML = store.cart.map(c => {
			const dish = store.dish.find(d => d.id === c.did)
			return `
        <div class="flex items-center justify-between border-b pb-2">
          <div>${dish.name} × ${c.num}</div>
          <div class="flex gap-2">
            <button data-did="${c.did}" class="cart-minus px-2 border">-</button>
            <button data-did="${c.did}" class="cart-plus px-2 border">+</button>
          </div>
        </div>
      `
		}).join('')
		// 购物车增减数量
		document.querySelectorAll('.cart-minus').forEach(b => {
			b.onclick = () => {
				const did = Number(b.dataset.did)
				const idx = store.cart.findIndex(c => c.did === did)
				store.cart[idx].num -= 1
				if (store.cart[idx].num <= 0) store.cart.splice(idx, 1)
				DB.set(store)
				renderCartNum()
				this.click()
			}
		})
		document.querySelectorAll('.cart-plus').forEach(b => {
			b.onclick = () => {
				const did = Number(b.dataset.did)
				const item = store.cart.find(c => c.did === did)
				item.num += 1
				DB.set(store)
				renderCartNum()
				this.click()
			}
		})
	}
	mask.classList.remove('hidden')
}

// 关闭全部弹窗通用绑定
document.querySelectorAll('.close-mask').forEach(el => {
	el.onclick = () => document.getElementById('mask').classList.add('hidden')
})
document.querySelector('.close-order-mask').onclick = () => {
	document.getElementById('orderMask').classList.add('hidden')
}
document.querySelector('.close-mine-mask').onclick = () => {
	document.getElementById('mineMask').classList.add('hidden')
}

// 清空购物车
document.getElementById('clearCart').onclick = function() {
	store.cart = []
	DB.set(store)
	renderCartNum()
	document.getElementById('mask').classList.add('hidden')
}

// 确认下单（下单自动刷新订单记录）
document.getElementById('confirmOrder').onclick = function() {
	const orderItem = store.cart.map(c => {
		const d = store.dish.find(di => di.id === c.did)
		return {
			name: d.name,
			num: c.num,
			price: d.price
		}
	})
	store.order.push({
		time: new Date().toLocaleString(),
		list: orderItem
	})
	// 扣库存+增加销量
	store.cart.forEach(c => {
		const dish = store.dish.find(d => d.id === c.did)
		dish.sales += c.num
		dish.stock -= c.num
	})
	store.cart = []
	DB.set(store)
	renderCartNum()
	renderDish()

	// 新增：下单完成自动刷新订单列表DOM
	const orderWrap = document.getElementById('orderList')
	if (store.order.length === 0) {
		orderWrap.innerHTML = '<p class="text-center text-gray-400">暂无下单记录</p>'
	} else {
		orderWrap.innerHTML = store.order.map(item => `
			<div class="border p-3 rounded-lg">
				<div class="text-sm text-gray-500 mb-2">下单时间：${item.time}</div>
				${item.list.map(li => `<div>${li.name} × ${li.num}</div>`).join('')}
			</div>
		`).join('')
	}

	document.getElementById('mask').classList.add('hidden')
}

// 随机点菜
document.getElementById('randomBtn').onclick = function() {
	const currList = store.dish.filter(d => d.cid === store.activeCid)
	if (currList.length === 0) return alert('当前分类暂无菜品')
	const randomIdx = Math.floor(Math.random() * currList.length)
	const target = currList[randomIdx]
	alert(`随机选中：${target.name}`)
	const cartItem = store.cart.find(c => c.did === target.id)
	if (cartItem) cartItem.num += 1
	else store.cart.push({
		did: target.id,
		num: 1
	})
	DB.set(store)
	renderCartNum()
}
// 底部绿色【下单】按钮：点击弹出购物车弹窗
document.getElementById('submitOrderBtn').onclick = function() {
	const mask = document.getElementById('mask')
	const cartWrap = document.getElementById('cartList')
	if (store.cart.length === 0) {
		cartWrap.innerHTML = '<p class="text-center text-gray-400">购物车空空如也</p>'
	} else {
		cartWrap.innerHTML = store.cart.map(c => {
			const dish = store.dish.find(d => d.id === c.did)
			return `
        <div class="flex items-center justify-between border-b pb-2">
          <div>${dish.name} × ${c.num}</div>
          <div class="flex gap-2">
            <button data-did="${c.did}" class="cart-minus px-2 border">-</button>
            <button data-did="${c.did}" class="cart-plus px-2 border">+</button>
          </div>
        </div>
      `
		}).join('')
		// 重新绑定加减数量按钮
		document.querySelectorAll('.cart-minus').forEach(b => {
			b.onclick = () => {
				const did = Number(b.dataset.did)
				const idx = store.cart.findIndex(c => c.did === did)
				store.cart[idx].num -= 1
				if (store.cart[idx].num <= 0) store.cart.splice(idx, 1)
				DB.set(store)
				renderCartNum()
				this.click()
			}
		})
		document.querySelectorAll('.cart-plus').forEach(b => {
			b.onclick = () => {
				const did = Number(b.dataset.did)
				const item = store.cart.find(c => c.did === did)
				item.num += 1
				DB.set(store)
				renderCartNum()
				this.click()
			}
		})
	}
	mask.classList.remove('hidden')
}

// 底部Tab切换：菜谱 / 订单 / 我的
document.querySelectorAll('.tab-item').forEach(tab => {
	tab.onclick = function() {
		document.querySelectorAll('.tab-item').forEach(t => {
			t.classList.remove('text-main', 'text-gray-500')
			t.classList.add('text-gray-500')
		})
		this.classList.remove('text-gray-500')
		this.classList.add('text-main')
		const type = this.dataset.tab
		if (type === 'order') {
			const orderWrap = document.getElementById('orderList')
			if (store.order.length === 0) {
				orderWrap.innerHTML = '<p class="text-center text-gray-400">暂无下单记录</p>'
			} else {
				orderWrap.innerHTML = store.order.map((item, index) => `
          <div class="border p-3 rounded-lg">
            <div class="text-sm text-gray-500 mb-2">下单时间：${item.time}</div>
            ${item.list.map(li=>`<div>${li.name} × ${li.num}</div>`).join('')}
          </div>
        `).join('')
			}
			document.getElementById('orderMask').classList.remove('hidden')
		} else if (type === 'mine') {
			document.getElementById('mineMask').classList.remove('hidden')
		}
	}
})

// 我的页面功能：重置库存、清空订单
document.getElementById('resetStockBtn').onclick = function() {
	store.dish.forEach(d => {
		d.stock = 999
		d.sales = 0
	})
	DB.set(store)
	renderDish()
	document.getElementById('mineMask').classList.add('hidden')
}
document.getElementById('clearAllOrderBtn').onclick = function() {
	store.order = []
	DB.set(store)
	document.getElementById('mineMask').classList.add('hidden')
}

// ==================== 4. 新增菜品弹窗功能模块（新增） ====================
const addDishMask = document.getElementById('addDishMask')
const openAddDishModal = document.getElementById('openAddDishModal')
const closeAddDishModal = document.getElementById('closeAddDishModal')
const submitAddDish = document.getElementById('submitAddDish')

const inputDishName = document.getElementById('inputDishName')
const selectCid = document.getElementById('selectCid')
const inputImgSrc = document.getElementById('inputImgSrc')
const inputPrice = document.getElementById('inputPrice')
const inputStock = document.getElementById('inputStock')

// 打开弹窗
openAddDishModal.addEventListener('click', () => {
	inputDishName.value = ''
	inputImgSrc.value = ''
	inputPrice.value = 0
	inputStock.value = 999
	// 生成分类下拉
	selectCid.innerHTML = ''
	store.subCategory.forEach(sub => {
		const opt = document.createElement('option')
		opt.value = sub.cid
		opt.innerText = sub.name
		selectCid.appendChild(opt)
	})
	addDishMask.classList.remove('hidden')
})
// 关闭弹窗
closeAddDishModal.addEventListener('click', () => {
	addDishMask.classList.add('hidden')
})
addDishMask.addEventListener('click', (e) => {
	if (e.target === addDishMask) addDishMask.classList.add('hidden')
})
// 提交新增菜品
submitAddDish.addEventListener('click', () => {
	const name = inputDishName.value.trim()
	const cid = Number(selectCid.value)
	const img = inputImgSrc.value.trim()
	const price = Number(inputPrice.value)
	const stock = Number(inputStock.value)

	if (!name) return alert('请填写菜品名称！')
	if (!img) return alert('请填写菜品图片路径，例如 ./img/xxx.jpg')

	const newFood = {
		id: Date.now(),
		cid: cid,
		name: name,
		img: img,
		star: 5,
		price: price,
		stock: stock,
		sales: 0
	}
	store.dish.push(newFood)
	DB.set(store)

	renderCategory()
	renderDish()
	renderCartNum()
	addDishMask.classList.add('hidden')
	alert(`菜品【${name}】添加成功！`)
})

// ==================== 5. 页面入口初始化 ====================
window.onload = function() {
	renderCategory()
	renderDish()
	renderCartNum()
}