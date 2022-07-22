var _setAttribute = Element.prototype.setAttribute;
Element.prototype.setAttribute = function (name, value) {
	_setAttribute.call(this, name, value);
	return this;
};
Element.prototype.setText = function (text) {
	this.textContent = text;
	return this;
};

Date.prototype.getYYYYMMDD = function () {
	var year = this.getFullYear().toString(10);
	var month = this.getMonth() + 1;
	month = (month < 10) ? "0" + month.toString(10) : month.toString(10);
	var date = this.getDate();
	date = (date < 10) ? "0" + date.toString(10) : date.toString(10);
	return year + month + date;
};

function DatePicker(element) {
	var that = this;
	this.buttons = [];
	this.buttons.push(element.getElementsByTagName("button").item(0));
	this.buttons.push(element.getElementsByTagName("button").item(1));
	this.buttons.push(element.getElementsByTagName("button").item(2));
	this.buttons[0].addEventListener("click", function () {
		that.prev();
	});
	this.buttons[1].addEventListener("click", function () {
		that.next();
	});
	this.buttons[2].addEventListener("click", function () {
		that.showCalendar();
	});
	this.dateTextView = element.getElementsByTagName("p").item(0);
	this.calendar = new Calendar(element.getElementsByTagName("table").item(0));
	this.calendar.setCellClickListener(function (date) {
		that.date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
		that.setDisabled(true);
		that.listener();
		that.drawDateText();
	});
	this.date = new Date();
	this.listener = null;
	this.drawDateText();
}
DatePicker.prototype = {
	DAYS : ["日", "月", "火", "水", "木", "金", "土"],
	drawDateText : function () {
		var text = "";
		if(this.calendar.isHidden()) {
			text = (this.date.getMonth() + 1) + "月" + this.date.getDate() + "日(" + this.DAYS[this.date.getDay()] + ")";
		} else {
			text =  this.calendar.getYear() + "年" + this.calendar.getMonth() + "月";
		}
		this.dateTextView.setText(text);
	},
	getDateString : function () {
		return this.date.getYYYYMMDD();
	},
	prev : function () {
		if(this.calendar.isHidden()) {
			this.date.setDate(this.date.getDate() - 1);
			this.setDisabled(true);
			this.listener();
		} else {
			this.calendar.prevMonth(this.date);
		}
		this.drawDateText();
	},
	next : function () {
		if(this.calendar.isHidden()) {
			this.date.setDate(this.date.getDate() + 1);
			this.setDisabled(true);
			this.listener();
		} else {
			this.calendar.nextMonth(this.date);
		}
		this.drawDateText();
	},
	setDisabled : function (disabled) {
		this.buttons[0].disabled = disabled;
		this.buttons[1].disabled = disabled;
		this.buttons[2].disabled = disabled;
	},
	showCalendar : function () {
		this.calendar.show(this.date);
		this.drawDateText();
	},
	setChangedListener : function (listener) {
		this.listener = listener;
	}
};

function Calendar(element) {
	var that = this;
	this.table = element;
	this.cells = element.getElementsByTagName("td");
	for(var i = 0; i < this.cells.length; i++) {
		this.cells.item(i).addEventListener("click", function () {
			if(event.target.textContent !== "") {
				that.date.setDate(event.target.textContent);
				that.hide();
				that.listener(that.date);
			}
		});
	}
	this.date = new Date();
	this.listener = null;
}
Calendar.prototype = {
	create : function (date) {
		for(var i = 0; i < this.cells.length; i++) {
			this.cells.item(i).setText("");
			this.cells.item(i).style.textDecoration = "none";
		}
		var year = this.date.getFullYear();
		var month = this.date.getMonth();
		var d = new Date(year, month, 1);
		var startDay = d.getDay();
		d.setMonth(d.getMonth() + 1);
		d.setDate(0);
		var endDate = d.getDate();
		for(var i = startDay, j = 1; j <= endDate; i++, j++) {
			this.cells.item(i).setText(j.toString(10));
			if(j === date.getDate() && month === date.getMonth() && year === date.getFullYear()) {
				this.cells.item(i).style.textDecoration = "underline";
			}
		}
	},
	show : function (date) {
		if(this.isHidden()) {
			this.date.setDate(1);
			this.date.setMonth(date.getMonth());
			this.date.setFullYear(date.getFullYear());
			this.create(date);
			this.table.style.display = "table";
		}
	},
	hide : function () {
		this.table.style.display = "none";
	},
	isHidden : function () {
		return (this.table.style.display === "none" || this.table.style.display === "") ? true : false;
	},
	getYear : function () {
		return this.date.getFullYear();
	},
	getMonth : function () {
		return this.date.getMonth() + 1;
	},
	prevMonth : function (date) {
		this.date.setDate(1);
		this.date.setMonth(this.date.getMonth() - 1);
		this.create(date);
	}, 
	nextMonth : function (date) {
		this.date.setDate(1);
		this.date.setMonth(this.date.getMonth() + 1);
		this.create(date);
	},
	setCellClickListener : function (listener) {
		this.listener = listener;
	}
};

window.Toast = {
	element : document.createElement("p").setAttribute("class", "toast"),
	makeText : function (text) {
		this.element.setText(text);
		return this;
	},
	show : function () {
		var that = this;
		document.body.appendChild(this.element);
		window.setTimeout(function () {
			document.body.removeChild(that.element);
		}, 5000);
	}
};

function LoginDialog() {
	var that = this;
	this.callback = null;
	this.errorMessageView = document.createElement("p");
	this.element = document.createElement("div").setAttribute("class", "dialog");
	this.element.appendChild(document.createElement("form"))
		.appendChild(document.createElement("label")
			.setText("社員番号")
			.setAttribute("for", "dNumber")
		).parentNode
		.appendChild(document.createElement("input")
			.setAttribute("type", "number")
			.setAttribute("id", "dNumber")
			.setAttribute("placeholder", "タップして入力")
		).parentNode
		.appendChild(document.createElement("label")
			.setText("パスワード")
			.setAttribute("for", "dPassword")
		).parentNode
		.appendChild(document.createElement("input")
			.setAttribute("type", "password")
			.setAttribute("id", "dPassword")
			.setAttribute("placeholder", "タップして入力")
		).parentNode
		.appendChild(this.errorMessageView).parentNode
		.appendChild(document.createElement("button")
			.setText("ログイン")
			.setAttribute("type", "button")
		).addEventListener("click", function () {
			var number = document.getElementById("dNumber").value;
			if(number === "") {
				that.errorMessageView.setText("社員番号を半角で入力してください。");
				return;
			}
			var password = document.getElementById("dPassword").value.trim();
			if(password === "") {
				that.errorMessageView.setText("パスワードを入力してください。");
				return;
			}
			event.target.disabled = true;
			event.target.setText("ログインしています...");
			that.errorMessageView.setText("");
			window.sessionStorage.setItem("number", number);
			window.sessionStorage.setItem("password", password);
			that.callback();
		});
}
LoginDialog.prototype = {
	dismiss : function () {
		document.body.removeChild(this.element);
	},
	setCallback : function (callback) {
		this.callback = callback;
	},
	setErrorMessage : function (errorMessage) {
		var button = this.element.getElementsByTagName("button").item(0);
		button.disabled = false;
		button.setText("ログイン");
		this.errorMessageView.setText(errorMessage);
	},
	show : function () {
		document.body.appendChild(this.element);
	}
};
