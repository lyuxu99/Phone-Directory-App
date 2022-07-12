/*-------------View-------------*/
const View = (() => {
  const render = (element, tmp) => {
    element.innerHTML = tmp;
  };

  const createTmp = (arr) => {
    let tmp = "";
    arr.forEach((element) => {
      tmp += `
          <tr>
              <td>${element.name}</td>
              <td>${element.mobile}</td>
              <td>${element.email}</td>
          </tr>
           `;
    });

    return tmp;
  };

  return {
    render,
    createTmp,
  };
})();

/*-------------Model-------------*/
const Model = ((view) => {
  class Info {
    constructor(name, mobile, email) {
      this.name = name;
      this.mobile = mobile;
      this.email = email;
    }
  }

  class State {
    InfoArr = [];
    getInfoArr() {
      return this.InfoArr;
    }

    setInfoArr(newInfoArr) {
      this.InfoArr = [...newInfoArr];
      const getTbody = document.querySelector("tbody");
      const tmp = view.createTmp(this.InfoArr);
      view.render(getTbody, tmp);
    }
  }

  const sortArr = (arr, sequence) => {
    if (sequence === "ascending") {
      arr.sort((a, b) => {
        if (a.name.toUpperCase() < b.name.toUpperCase()) {
          return -1;
        }
        if (a.name.toUpperCase() > b.name.toUpperCase()) {
          return 1;
        }
        return 0;
      });
    } else if (sequence === "desending") {
      arr.sort((a, b) => {
        if (a.name.toUpperCase() > b.name.toUpperCase()) {
          return -1;
        }
        if (a.name.toUpperCase() < b.name.toUpperCase()) {
          return 1;
        }
        return 0;
      });
    }
    return arr;
  };

  const isValid = (name, mobile, email) => {
    if (name.length < 20 && name.length > 0) {
      if (!/^[a-zA-Z\s]+$/.test(name)) {
        return false;
      }
    } else {
      return false;
    }

    if (!(mobile.toString().length === 10)) {
      return false;
    }

    if (!(email.includes("@") && email.length < 40)) {
      return false;
    }

    return true;
  };

  return {
    Info,
    State,
    sortArr,
    isValid,
  };
})(View);

/*-------------Controllor-------------*/
const Controllor = ((model, view) => {
  let isClicked = false;
  const state = new model.State();
  let testContactList = [
    { name: "Antra", mobile: "123456789", email: "xxx@xxx.com" },
    { name: "iron man", mobile: "12121212", email: "xxx@xxx.com" },
    { name: "thor", mobile: "13131313", email: "xxx@xxx.com" },
    { name: "captian america", mobile: "888888888", email: "xxx@xxx.com" },
    { name: "black widow", mobile: "321123321", email: "xxx@xxx.com" },
  ];
  state.setInfoArr(testContactList);
  let filteredArr = [];
  const init = () => {
    addContact();
    handleSearch();
    sortByName();
  };

  const addContact = () => {
    const nameBox = document.getElementById("name");
    const mobileBox = document.getElementById("mobile");
    const emailBox = document.getElementById("email");
    const submitBtn = document.getElementById("submit");
    const errorMsg = document.getElementById("error");

    submitBtn.addEventListener("click", () => {
      if (model.isValid(nameBox.value, mobileBox.value, emailBox.value)) {
        errorMsg.classList.add("dn");
        const newContact = new model.Info(
          nameBox.value,
          mobileBox.value,
          emailBox.value
        );
        console.log(newContact);
        const newArr = [...state.InfoArr, newContact];
        state.setInfoArr(newArr);
        nameBox.value = "";
        mobileBox.value = "";
        emailBox.value = "";
      } else {
        errorMsg.classList.remove("dn");
      }
    });
  };

  const handleSearch = () => {
    const searchBox = document.getElementById("search");
    const getTbody = document.querySelector("tbody");
    searchBox.addEventListener("keyup", (event) => {
      console.log(state.getInfoArr());
      const newArr = state.InfoArr.filter((infoObj) => {
        return infoObj.mobile.toString().includes(event.target.value);
      });
      let tmp = "";
      if (newArr.length === 0) {
        tmp = "No result!";
      } else {
        console.log(newArr);
        filteredArr = newArr;
        tmp = view.createTmp(newArr);
      }
      view.render(getTbody, tmp);
    });
  };

  const sortByName = () => {
    const nameCol = document.getElementById("nameColumn");
    const getTbody = document.querySelector("tbody");
    nameCol.addEventListener("click", (event) => {
      isClicked = !isClicked;
      let tmp = "";
      if (filteredArr.length === 0) {
        const getCurrentArr = [...state.getInfoArr()];
        model.sortArr(getCurrentArr, isClicked ? "ascending" : "desending");
        tmp = view.createTmp(getCurrentArr);
      } else {
        tmp = view.createTmp(
          model.sortArr(filteredArr, isClicked ? "ascending" : "desending")
        );
      }
      view.render(getTbody, tmp);
    });
  };

  return {
    init,
  };
})(Model, View);

Controllor.init();
