let classList = [];
let pageSizeClass = 5;
let pageNumberClass = 1;
let sortBy_Class = "id";
let sortType_Class = "DESC";


//Giao diện: 2 bước
//Bước 1: Call API -> danh sách
//Bước 2: lấy danh sách fill ra bảng hoặc vào form (build phân trang)

//Fill dữ liệu ra bảng: Dùng for gán các giá trị  vào 1 base HTML




let className = "";

let apiClass = "http://localhost:8686/api/v1/classEntity";

$(function () {
    buildClassPage();
    buildMentorToForm();
    buildClassRoomToForm();
    buildZoomToForm();
})


function buildClassPage() {
    classList = [];
    getListClass();
}

function SearchClassRequest(pageSize, pageNumber, sortBy, sortType, className){
    this.pageSize = pageSize;
    this.pageNumber = pageNumber;
    this.sortField = sortBy;
    this.sortType = sortType;
    this.className = className;
}

//  ----------------------------------------------------------------------------=
// gọi api GetAllClass
async function getListClass() {
    let request = new SearchClassRequest(pageSizeClass, pageNumberClass-1, sortBy_Class, sortType_Class, className);
    $.ajax({
        url: apiClass + "/search",
        type: "POST",
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("token"));
        },
        contentType: "application/json",
        data: JSON.stringify(request),
        error: function (err) {
          console.log(err)
          showAlrtError("Lấy danh sách Class Room thất bại")
        },
        success: function (data) {
            filltoTable(data.content);
            buildPaginationClass(data.number + 1, data.totalPages);
        }
      });
}

function seachClass(){
    className = document.getElementById("seachname").value;
    pageNumberClass = 1;
    getListClass();
}

function filltoTable(json) {
    if (json) {
        classList = json;
    }
    // check form trống để k lặp lại khi chuyền data
    $('#table-class').empty();
    var index = 1;
    console.log(classList);
    classList.forEach(function (item) {
        $('#table-class').append(
            '<tr>' +
            '<td>' + (index++) + '</td>' +
            '<td> ' + item.className + '</td>' +
            '<td>' + item.startDate + '</td>' +
            '<td>' + item.endDate + '</td>' +
            '<td>' + item.classStatus + '</td>' +
            // '<td>' + item.studentNumber + '</td>' +
            '<td>' + item.teachingForm + '</td>' +
            '<td>' + item.mentor.fullName + '</td>' +
            '<td>' + item.description + '</td>' +

            '<td>' +
            '<a class="edit" title="go to  detail" data-toggle="tooltip" onclick="editClass(' +
            item.id + ')"><i class="ti-pencil m-1 text-warning" style="font-size:24px; cursor: pointer;"></i></a>' +
            '<a class="edit" title="go to  detail" data-toggle="tooltip" onclick="confirmDeleteClass(' +
            item.id + ')"><i class="ti-trash m-1 text-danger" style="font-size:24px; cursor: pointer;"></i></a>' +
            // '<a class="edit" title="go to  detail" data-toggle="tooltip" onclick="viewStudent(' +
            // item.id + ')"><i class="ti-search m-1 text-primary" style="font-size:24px; cursor: pointer;"></i></a>' +
            '</td>' +
            '</tr>'
        )
    });
}


function buildPaginationClass(number, totalPages) {
    // kiểm tra nếu trang hiện tại là trang đầu -> disable đi

    if (number === 1) {
        $("#pagination-class").empty().append(
            `<li class="page-item">
            <a class="page-link disabled" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
                <span class="sr-only">Previous</span>
            </a>
        </li>`);
    } else {
        $("#pagination-class").empty().append(
            `<li class="page-item">
            <a class="page-link" href="#" aria-label="Previous" onclick="prePageClass()">
                <span aria-hidden="true">&laquo;</span>
                <span class="sr-only">Previous</span>
            </a>
        </li>`);
    }

    // Dùng hàm for để build ra số trang. Kiểm tra xem trang hiện tại là bao nhiêu thì background vàng
    for (let index = 1; index <= totalPages; index++) {
        if (number === (index)) {
            $('#pagination-class').append(`<li class="page-item "><a class="page-link bg-primary" href="#" onclick="chosePageClass(` + index + `)">` + index + `</a></li>`);
        } else {
            $('#pagination-class').append(`<li class="page-item"><a class="page-link" href="#" onclick="chosePageClass(` + index + `)">` + index + `</a></li>`);
        }
    }

    // Kiểm tra nếu trang hiện tại là trang cuối -> disable đ
    if (number === totalPages) {
        $("#pagination-class").append(
            `<li class="page-item">
            <a class="page-link" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
                <span class="sr-only">Next</span>
            </a>
        </li>`);
    } else {
        $("#pagination-class").append(
            `<li class="page-item">
            <a class="page-link" href="#" aria-label="Next" onclick="nextPageClass()">
                <span aria-hidden="true">&raquo;</span>
                <span class="sr-only">Next</span>
            </a>
        </li>`);
    }
}

function chosePageClass(page) {
    // event.preventDefault()
    pageNumberClass = page;
    getListClass();
}
function prePageClass() {
    // event.preventDefault()
    pageNumberClass--;
    getListClass();
}

function nextPageClass() {
    // event.preventDefault()
    pageNumberClass++;
    getListClass();
}

function addClass(){
    resetFromEditClass();
    $('#classModal').modal('show')
}

function editClass(classId){
    let class_ = classList.find(class_ => class_.id === classId)
    console.log(classList, class_);
    resetFromEditClass();
    $('#cl-id').val(class_.id);
    $('#cl-name').val(class_.className);
    $('#cl-startDate').val(new Date(class_.startDate).toISOString().substring(0, 10));
    $("#cl-endDate").val(new Date(class_.endDate).toISOString().substring(0, 10));
    $("#cl-classStatus").val(class_.classStatus);
    $("#cl-teachingForm").val(class_.teachingForm);
    $("#cl-mentor").val(class_.mentor.id);
    $("#cl-classRoomId").val(class_.classRoom.id);
    $("#cl-zoomId").val(class_.zoom.id);
    $("#cl-information").val(class_.description);

    $('#classModal').modal('show')
}

function saveClass() {
    // Lấy các thông số để lưu
    let accountId = $('#cl-id').val();
    let name = $('#cl-name').val();
    let startDate = $('#cl-startDate').val();
    let endDate = $("#cl-endDate").val();
    let classStatus = $("#cl-classStatus").val();
    let teachingForm = $("#cl-teachingForm").val();
    let mentor = $("#cl-mentor").val();
    let classRoomId = $("#cl-classRoomId").val();
    let zoomId = $("#cl-zoomId").val();
    let information = $("#cl-information").val();
    // let username = $('#ac-username').val();
    // let fullName = $('#ac-fullName').val();
    // let dateOfBirth = $("#ac-birthDay").val();
    // let phoneNumber = $("#ac-phoneNumber").val();
    // let role = $("#ac-role").val();
    // let address = $("#ac-address").val();
    // let email = $("#ac-email").val();
    // let facebook = $("#ac-facebook").val();
    // let information = $("#ac-information").val();
    // let classId = $("#ac-class").val();
// ---------------------------------- CALL API UPDATE OR CREATE ----------------------------------

    let request = {
        "className": name,
        "id": accountId,
        "startDate": startDate,
        "endDate": endDate,
        "classStatus": classStatus,
        "teachingForm": teachingForm,
        "accountId": mentor,
        "classRoomId": classRoomId,
        "zoomId": zoomId,
        "description": information,
    };

    let api = accountId ? apiClass +"/update" : apiClass + "/create";
    let method = accountId ? "PUT": "POST";
    let  message = accountId ? "Update thành công" : "Thêm mới thành công"

    $.ajax({
        url: api,
        type: method,
        beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("token"));
        },
        contentType: "application/json",
        data: JSON.stringify(request),
        error: function (err) {
        console.log(err)
        showAlrtError("Update thất bại");
        },
        success: function (data) {
            $('#classModal').modal('hide')
            showAlrtSuccess(message);
            getListClass();
        }
    });



    // let text = accountId ? "Update Class thành công" : "Thêm mới Class thành công"

    // $('#classModal').modal('hide')
    // showAlrtSuccess(text);
}

function resetFromEditClass(){
    // $('#ac-id').val("");
    // $('#ac-username').val("");
    // $('#ac-fullName').val("");
    // $("#ac-birthDay").val("");
    // $("#ac-phoneNumber").val("");
    // $("#ac-role").val("STUDENT");
    // $("#ac-address").append("");
    // $("#ac-email").val("");
    // $("#ac-facebook").val("");
    // $("#ac-information").val("");
    // $("#ac-class").val("");

    document.getElementById("cl-id").value = "";
    document.getElementById("cl-name").value = "";
    document.getElementById("cl-startDate").value = "";
    document.getElementById("cl-endDate").value = "";
    document.getElementById("cl-classStatus").value = "";
    document.getElementById("cl-teachingForm").value = "";
    document.getElementById("cl-mentor").value = "";
    document.getElementById("cl-classRoomId").value = "";
    document.getElementById("cl-zoomId").value = "";
    document.getElementById("cl-information").value = "";
}

function confirmDeleteClass(classId) {
    $('#confirmDeleteClass').modal('show')
    $('#classIdToDelete').val(classId)
}

function deleteClass() {
    let classId = document.getElementById("classIdToDelete").value;
    console.log(classId);
    // $('#confirmDeleteClass').modal('hide')
// ---------------------------------- CALL API DELETE ----------------------------------
    $.ajax({
        url: apiClass + "/" + classId,
        type: "DELETE",
        beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("token"));
        },
        contentType: "application/json",
        // data: JSON.stringify(request),
        error: function (err) {
        console.log(err)
        showAlrtError("Delete Class Không thành công");
        },
        success: function (data) {
            $('#confirmDeleteClass').modal('hide')
            showAlrtSuccess("Xoá Class thành công!");
            getListClass();
        }
    });
    // showAlrtSuccess("Xoá account thành công!");
}

function viewStudent(classId){
    console.log(classId)
    // Call API lấy danh sách Account theo classId
    // fake
    fetch('./assets/data/account.json')
        .then((response) => response.json())
        .then((json) => {
            fillAccountToTable(json.content);
        }
        );
    $('#viewStudent').modal('show')
}

function fillAccountToTable(accounts){
    var index = 1;
    $('#table-account').empty()
    accounts.forEach(function (item) {
        $('#table-account').append(
            '<tr>' +
            '<td>' + (index++) + '</td>' +
            '<td>' + item.username + '</td>' +
            '<td>' + item.dateOfBirth + '</td>' +
            '<td>' + item.address + '</td>' +
            '<td>' + item.fullName + '</td>' +
            '<td>' + item.role + '</td>' +
            '<td>' + item.phoneNumber + '</td>' +
            '<td>' + item.email + '</td>' +
            '<td><a target="_blank" href=' + '"' + item.facebook + '"> ' + item.facebook + '<a/></td>' +
            '</tr>'
        )
    });
}

// ------------------------------ Build form add class ----------------------------------
function buildMentorToForm(){
    // -------------------- CALL API Get All Account is Mentor ----------------
    $.ajax({
        url: "http://localhost:8686/api/v1/account/getAll-mentor",
        type: "GET",
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("token"));
        },
        contentType: "application/json",
        error: function (err) {
          console.log(err)
          showAlrtError("Lấy danh sách Class Room thất bại")
        },
        success: function (data) {
            fillMentorToForm(data);
        }
      });
}

function fillMentorToForm(data){
    if(data){
        $('#cl-mentor').empty();
        data.forEach(function (item) {
            $('#cl-mentor').append(
                `<option value="`+item.id +`">`+item.fullName+`</option>`
            )
        });
    }
}

function buildClassRoomToForm(){
    // -------------------- CALL API Get All Class Room ----------------
    $.ajax({
        url: "http://localhost:8686/api/v1/classRoom/getAll",
        type: "GET",
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("token"));
        },
        contentType: "application/json",
        error: function (err) {
          console.log(err)
          showAlrtError("Lấy danh sách Class Room thất bại")
        },
        success: function (data) {
            fillClassRoomToForm(data);
        }
      });
}

function fillClassRoomToForm(data){
    if(data){
        $('#cl-classRoomId').empty();
        data.forEach(function (item) {
            $('#cl-classRoomId').append(
                `<option value="`+item.id +`">`+item.name+`</option>`
            )
        });
    }
}

function buildZoomToForm(){
    // -------------------- CALL API Get All Zoom ----------------
    $.ajax({
        url: "http://localhost:8686/api/v1/zoom/getAll",
        type: "GET",
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("token"));
        },
        contentType: "application/json",
        error: function (err) {
          console.log(err)
          showAlrtError("Lấy danh sách Class thất bại")
        },
        success: function (data) {
            fillZoomToForm(data);
        }
    });
    
}

function fillZoomToForm(data){
    if(data){
        $('#cl-zoomId').empty();
        data.forEach(function (item) {
            $('#cl-zoomId').append(
                `<option value="`+item.id +`">`+item.name+`</option>`
            )
        });
    }
}