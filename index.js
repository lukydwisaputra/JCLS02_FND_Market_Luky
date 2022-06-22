let warehouse = [];
let cartList = [];
let checkoutList = [];
let reportList = [];
let totalPurchase = 0;
let id = 3;
let isLogin = false;
let user = "";
class General {
	constructor(name, sku, preview, category, stock, price) {
		this.name = name;
		this.sku = sku;
		this.preview = preview;
		this.category = category;
		this.stock = stock;
		this.price = price;
	}
}
class FnB extends General {
	constructor(name, sku, preview, category, stock, price, expired) {
		super(name, sku, preview, category, stock, price);
		this.expired = expired;
	}
}
class Cart {
	constructor(name, sku, preview, price, quantity) {
		this.sku = sku;
		this.preview = preview;
		this.name = name;
		this.price = price;
		this.quantity = quantity;
		this.subtotal = this.price * this.quantity;
	}
}
class Report {
	constructor(date, name, totalTransaction, isLogin) {
		this.date = date;
		this.name = name;
		this.totalTransaction = totalTransaction;
		this.isLogin = isLogin;
	}
}

warehouse.push(new General("Topi", "SKU-1-456789", "https://www.jakartanotebook.com/images/products/95/63/27652/124/jiangxihuitian-topi-baseball-polos-xx2-black-with-white-side-141.jpg", "General", 15, 150000));
warehouse.push(new FnB("Jus Kemasan", "SKU-2-123456", "https://img.my-best.id/press_component/images/22e63af38d2b1403aa0d7a78952107c8.jpg?ixlib=rails-4.2.0&q=70&lossless=0&w=690&fit=max", "FnB", 20, 15000, "2023-08-19"));
warehouse.push(new FnB("Tomat", "SKU-3-123456", "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Tomato_je.jpg/800px-Tomato_je.jpg", "FnB", 100, 750, "2022-07-24"));

const getFormValue = (data, sku) => {
	document.getElementById("list-data").innerHTML = data
		.map((v, i) => {
			v.category == "General" ? (v.expired = "-") : v.expired;
			v.expired == "" ? "-" : v.expired;

			if (v.sku == sku) {
				return `
			<tr>
				<td>${i + 1}.</td>
				<td><input id="edit-name" type="text" placeholder="${v.name}"></td>
				<td>${v.sku}</td>
				<td><img src="${v.preview}" alt="${v.name}" width="75px"></td>
				<td>${v.category}</td>
				<td><input id="edit-stock" type="number" placeholder="${v.stock}"></td>
				<td><input id="edit-price" type="number" placeholder="${v.price}"></td>
				<td>${v.expired}</td>
				<td>
				<button type="button" onclick="saveEdit('${v.sku}')">Save</button>
				<button type="button" onclick="getFormValue(warehouse)">Cancel</button>
				</td>
			<tr>`;
			} else {
				return `
			<tr>
				<td>${i + 1}.</td>
				<td>${v.name}</td>
				<td>${v.sku}</td>
				<td><img src="${v.preview}" alt="${v.name}" width="75px"></td>
				<td>${v.category}</td>
				<td>${v.stock}</td>
				<td>IDR. ${parseInt(v.price).toLocaleString("id")}</td>
				<td>${v.expired}</td>
				<td>
				<button type="button" onclick="editData('${v.sku}')">Edit</button>
				<button type="button" onclick="deleteData('${v.sku}')">Delete</button>
				<button type="button" onclick="buyProduct('${v.sku}')">Buy</button>
				</td>
			<tr>`;
			}
		})
		.join("");
};

getFormValue(warehouse);

const handleSubmit = () => {
	let form = document.getElementById("data-form");
	console.log(id);
	id += 1;

	let name = form.elements["name"].value;

	// SKU-id-6digitRandomNumber
	let randomNumber = Math.floor(100000 + Math.random() * 900000);
	let sku = `SKU-${id}-${randomNumber}`;

	let preview = form.elements["preview"].value;
	let category = form.elements["category"].value;
	let stock = form.elements["stock"].value;
	let price = form.elements["price"].value;
	let expired = form.elements["expired"].value;

	if (name == "" || sku == "" || preview == "" || category == "" || stock == "" || price == "") {
		alert("Input yang Anda masukan tidak lengkap");
	} else {
		category == "General" ? (expired = "") : expired;
		expired == "" ? warehouse.push(new General(name, sku, preview, category, stock, price)) : warehouse.push(new FnB(name, sku, preview, category, stock, price, expired));

		// reset form
		document.getElementById("data-form").reset();

		getFormValue(warehouse);
	}
};

const disableExpired = () => {
	let form = document.getElementById("data-form");
	let category = form.elements["category"].value;

	category == "FnB" ? (document.getElementById("expired").disabled = false) : (document.getElementById("expired").disabled = true);
};

// filter name, sku, category, harga
const filterProduct = () => {
	document.getElementById("list-data").innerHTML = "";
	let form = document.getElementById("filter");
	console.log(form);

	let inputObject = {};

	form.elements["fil_name"].value == "" ? "" : (inputObject.name = form.elements["fil_name"].value);
	form.elements["fil_sku"].value == "" ? "" : (inputObject.sku = form.elements["fil_sku"].value);
	form.elements["fil_price"].value == "" ? "" : (inputObject.price = form.elements["fil_price"].value);
	form.elements["fil_category"].value == "" ? "" : (inputObject.category = form.elements["fil_category"].value);

	let inputKeys = Object.keys(inputObject);
	let inputValues = Object.values(inputObject);

	console.log(inputKeys);
	console.log(inputValues);

	let result = [];
	warehouse.forEach((value) => {
		let check = [];
		inputKeys.forEach((v, i) => {
			if (value[inputKeys[i]] == inputValues[i]) {
				check.push(true);
				if (check.length == inputKeys.length) {
					result.push(value);
				}
			}
		});
	});

	if (result.length == 0) {
		alert("Produk tidak ditemukan !");
	} else {
		getFormValue(result);
	}
};

const resetFilter = () => {
	document.getElementById("filter").reset();
	getFormValue(warehouse);
};

const deleteData = (sku) => {
	let index = warehouse.findIndex((val) => val.sku == sku);
	warehouse.splice(index, 1);
	getFormValue(warehouse);
};

const editData = (sku) => {
	getFormValue(warehouse, sku);
};

const saveEdit = (sku) => {
	let index = warehouse.findIndex((val) => val.sku == sku);
	document.getElementById("edit-name").value == "" ? "" : (warehouse[index].name = document.getElementById("edit-name").value);
	document.getElementById("edit-stock").value == "" ? "" : (warehouse[index].stock = document.getElementById("edit-stock").value);
	document.getElementById("edit-price").value == "" ? "" : (warehouse[index].price = document.getElementById("edit-price").value);

	// let name = document.getElementById("edit-name").value;
	// let stock = document.getElementById("edit-stock").value;
	// let price = document.getElementById("edit-price").value;

	// spread operator -> right value overriding initial value
	// warehouse[index] = {...warehouse[index], name, stock, price}
	getFormValue(warehouse);
};

const decr = (sku) => {
	let warehouseIndex = warehouse.findIndex((val) => val.sku == sku);
	let cartListIndex = cartList.findIndex((val) => val.sku == sku);

	if (cartList[cartListIndex].quantity == 1) {
		cartList[cartListIndex].quantity -= 1;
		warehouse[warehouseIndex].stock += 1;

		deleteCart(sku);
		getFormValue(warehouse);
		displayCartList();
	} else {
		cartList[cartListIndex].quantity -= 1;
		warehouse[warehouseIndex].stock += 1;

		getFormValue(warehouse);
		displayCartList();
	}
};

const incr = (sku) => {
	let warehouseIndex = warehouse.findIndex((val) => val.sku == sku);
	let cartListIndex = cartList.findIndex((val) => val.sku == sku);

	if (warehouse[warehouseIndex].stock > 0) {
		cartList[cartListIndex].quantity += 1;
		warehouse[warehouseIndex].stock -= 1;

		getFormValue(warehouse);
		displayCartList();
	} else {
		alert(`Stock ${warehouse[warehouseIndex].name} tidak cukup!`);
	}
};

const buyProduct = (sku) => {
	if (isLogin) {
		let warehouseIndex = warehouse.findIndex((val) => val.sku == sku);
		let cartListIndex = cartList.findIndex((val) => val.sku == sku);
	
		let isEmptyCart = cartList.length == 0;
	
		if (isEmptyCart || cartListIndex == -1) {
			cartList.push(new Cart(warehouse[warehouseIndex].name, warehouse[warehouseIndex].sku, warehouse[warehouseIndex].preview, warehouse[warehouseIndex].price, 1));
			warehouse[warehouseIndex].stock -= 1;
			getFormValue(warehouse);
			displayCartList();
		} else if (cartListIndex >= 0) {
			incr(sku);
		}
	} else {
		alert("Silakan login terlebih dahulu")
	}
};

const displayCartList = () => {
	document.getElementById("cart-list").innerHTML = cartList
		.map((v, i) => {
			return `
		<tr>
			<td><input id="check-${v.sku}" type="checkbox"></td>
			<td>${v.sku}</td>
			<td><img src="${v.preview}" alt="${v.name}" width="75px"></td>
			<td>${v.name}</td>
			<td>IDR. ${parseInt(v.price).toLocaleString("id")}</td>
			<td><button type="button" onclick="decr('${v.sku}')">-</button> ${v.quantity} <button type="button" onclick="incr('${v.sku}')">+</button></td>
			<td>IDR. ${(parseInt(v.price) * parseInt(v.quantity)).toLocaleString("id")} </td>
			<td>
			<button type="button" onclick="deleteCart('${v.sku}')">Delete</button> 
			</td>
		<tr>`;
		})
		.join("");
};

const clearCart = () => {
	let selectedItems = [];

	cartList.forEach((v) => {
		if (document.getElementById(`check-${v.sku}`).checked) {
			selectedItems.push(v);
		}
	});

	if (selectedItems.length == 0) {
		alert("Tidak ada produk yang dipilih..");
	} else if (confirm("Hapus belanjaan yang dipilih ?")) {
		selectedItems.forEach((val, idx) => {
			if (selectedItems[idx].sku == val.sku) {
				selectedItems.forEach((v) => {
					deleteCart(v.sku);
				});
			}
		});
	}
};

const deleteCart = (sku) => {
	let warehouseIndex = warehouse.findIndex((val) => val.sku == sku);
	let cartListIndex = cartList.findIndex((val) => val.sku == sku);

	warehouse[warehouseIndex].stock = warehouse[warehouseIndex].stock + cartList[cartListIndex].quantity;
	cartList.splice(cartListIndex, 1);
	getFormValue(warehouse);
	displayCartList();
};

const handleCheckout = () => {
	cartList.forEach((value) => {
		if (document.getElementById(`check-${value.sku}`).checked) {
			checkoutList.push(value);
		}
	});

	document.getElementById("checkout-list").innerHTML = checkoutList
		.map((v, i) => {
			return `
		<tr>
		<td>${v.sku}</td>
		<td>IDR. ${(parseInt(v.price) * parseInt(v.quantity)).toLocaleString("id")}</td>
		<tr>`;
		})
		.join("");

	checkoutList.forEach((v) => {
		totalPurchase += parseInt(v.price) * parseInt(v.quantity);
	});

	document.getElementById("purchase-amount").innerHTML = `IDR. ${parseInt(totalPurchase).toLocaleString("id")},-`;

	checkoutList.forEach((val, idx) => {
		cartList.forEach((v, i) => {
			if (val.sku == v.sku) {
				cartList.splice(i, 1);
				displayCartList();
				getFormValue(warehouse);
			}
		});
	});
};

const handlePayment = () => {
	if (isLogin) {
		let cashAmount = parseInt(document.getElementById("cash-amount").value);
		console.log(cashAmount, totalPurchase);
		if (cashAmount >= totalPurchase) {

			let report = { user, totalPurchase };

			reportList.push(report);
			console.log(reportList);
			displayReport();

			alert(`Transaksi berhasil, kembalian anda adalah IDR. ${(cashAmount - totalPurchase).toLocaleString("id")}`);
			handleCheckout();
			checkoutList = [];
			totalPurchase = 0;
			displayCartList();
			document.getElementById("disp-payment-error").innerHTML = "";
			document.getElementById("checkout-list").innerHTML = "";
			document.getElementById("cash-amount").value = "";
			document.getElementById("purchase-amount").innerHTML = "IDR. 0,-";
		} else {
			document.getElementById("disp-payment-error").innerHTML = `Total belanjaan anda IDR. ${totalPurchase.toLocaleString("id")},-. <br>Uang anda tidak cukup..`;
		}
	} else {
		alert("Silakan login terlebih dahulu");
	}
};

const handleLogin = () => {
	let username = document.getElementById("username").value;

	if (username && username != "") {
		user = username;
		isLogin = true;
		document.getElementById("login-info").innerHTML = "<strong>Login berhasil..</strong>";
	} else {
		document.getElementById("login-info").innerHTML = "<strong>Login gagal, coba kembali..</strong>";
	}
};

const displayReport = () => {
	document.getElementById("report-table").innerHTML = reportList
		.map((v, i) => {
			return `
		<tr>
			<td>${i + 1}</td>
			<td>${Date()}</td>
			<td>${v.user}</td>
			<td>IDR. ${parseInt(v.totalPurchase).toLocaleString('id')}</td>
		<tr>`;
	}).join("");

	let omzet = 0;
	reportList.forEach(v => {
		omzet += v.totalPurchase;
	})
	
	document.getElementById("display-omzet").innerHTML = `<strong>OMZET : IDR. ${parseInt(omzet).toLocaleString('id')}</strong>`;

	document.getElementById("username").value = "";
	document.getElementById("login-info").innerHTML = "";
	user = "";
	isLogin = false;
};