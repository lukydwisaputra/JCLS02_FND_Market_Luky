let warehouse = [];
let id = 3;

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
				</td>
			<tr>`;
			}
		})
		.join("");
};

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
	warehouse.forEach((value, index) => {
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
	getFormValue(warehouse);
};
