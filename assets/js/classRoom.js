let classRooms = [];
let pageSizeRoom = 5;
let pageNumberRoom = 1;
let sortBy = "id";
let sortType = "DESC";
let apiClassRoom = "http://localhost:8686/api/v1/classRoom";

//Tạo biến với các thông số tìm kiếm
let classRoomName = "";
let address = "";
let minSize;
let maxSize;

function SearchRoomRequest(pageSizeRoom, pageNumberRoom, sortBy, sortType, name, address, minSize, maxSize) {
    this.pageSize = pageSizeRoom;
    this.pageNumber = pageNumberRoom;
    this.sortField = sortBy;
    this.sortType = sortType;

    this.name = name;
    this.address = address;
    this.minSize = minSize;
    this.maxSize = maxSize;
}

$(function () {
    console.log("Room")
    GetListClassRooms();
})

function buildClassRoomPage() {
    classRooms = [];
    GetListClassRooms();
}

function searchClassRoom() {
    // Sửa lại các biến tìm kiếm và phân trang
    pageNumberRoom = 1;
    classRoomName = document.getElementById("seachname").value;

    GetListClassRooms();
}

//------------------------------------ gọi api GetAllZoom
async function GetListClassRooms() {
    let request = new SearchRoomRequest(pageSizeRoom, pageNumberRoom-1, sortBy, sortType, classRoomName, address, minSize, maxSize);
    $.ajax({
        url: apiClassRoom + "/search-v2",
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
          fillClassRoomToTable(data.content);
          buildPaginationClassRoom(data.number + 1, data.totalPages);
        }
      });

    // fetch('./assets/data/class-room.json')
    //     .then((response) => response.json())
    //     .then((json) => {
    //         fillRoomToTable(json.content);
    //         buildPaginationRoom(json.number + 1, json.totalPages);
    //     });
}

function fillClassRoomToTable(json) {
    if (json) {
        classRooms = json;
    }
    // check form trống để k lặp lại khi chuyền data
    $('tbody').empty();
    var index = 1;
    console.log(classRooms);
    classRooms.forEach(function (item) {
        $('tbody').append(
            '<tr>' +
            '<td>' + (index++) + '</td>' +
            '<td>' + item.name + '</td>' +
            '<td>' + item.address + '</td>' +
            '<td>' + item.size + '</td>' +
            '<td>' + item.note + '</td>' +
            '<td>' +
            '<a class="edit" title="go to  detail" data-toggle="tooltip" onclick="editRoom(' +
            item.id + ')"><i class="ti-pencil m-1 text-warning" style="font-size:24px; cursor: pointer;"></i></a>' +
            '<a class="edit" title="go to  detail" data-toggle="tooltip" onclick="confirmDeleteRoom(' +
            item.id + ')"><i class="ti-trash m-1 text-danger" style="font-size:24px; cursor: pointer;"></i></a>' +
            '</td>' +
            '</tr>'
        )
    });
}

function buildPaginationClassRoom(number, totalPages) {
    // kiểm tra nếu trang hiện tại là trang đầu -> disable đi
    if (number === 1) {
        $("#pagination-room").empty().append(
            `<li class="page-item">
            <a class="page-link disabled" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
                <span class="sr-only">Previous</span>
            </a>
        </li>`);
    } else {
        $("#pagination-room").empty().append(
            `<li class="page-item">
            <a class="page-link" href="#" aria-label="Previous" onclick="prePageRoom()">
                <span aria-hidden="true">&laquo;</span>
                <span class="sr-only">Previous</span>
            </a>
        </li>`);
    }

    // Dùng hàm for để build ra số trang. Kiểm tra xem trang hiện tại là bao nhiêu thì background vàng
    for (let index = 1; index <= totalPages; index++) {
        if (number === (index)) {
            $('#pagination-room').append(`<li class="page-item "><a class="page-link bg-primary">` + index + `</a></li>`);
        } else {
            $('#pagination-room').append(`<li class="page-item"><a class="page-link" onclick="chosePageRoom(` + index + `)">` + index + `</a></li>`);
        }
    }

    // Kiểm tra nếu trang hiện tại là trang cuối -> disable đ
    if (number === totalPages) {
        $("#pagination-room").append(
            `<li class="page-item">
            <a class="page-link" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
                <span class="sr-only">Next</span>
            </a>
        </li>`);
    } else {
        $("#pagination-room").append(
            `<li class="page-item">
            <a class="page-link" aria-label="Next" onclick="nextPageRoom()">
                <span aria-hidden="true">&raquo;</span>
                <span class="sr-only">Next</span>
            </a>
        </li>`);
    }
}

function chosePageRoom(page) {
    pageNumberRoom = page;
    GetListClassRooms();
}
function prePageRoom() {
    pageNumberRoom--;
    GetListClassRooms();
}

function nextPageRoom() {
    pageNumberRoom++;
    GetListClassRooms();
}

function addRoom() {
    resetFormEditRoom();
    $('#roomModal').modal('show')
}

function editRoom(roomId) {
    let room = classRooms.find(room => room.id === roomId)
    console.log(room);
    resetFormEditRoom();
    $('#roomIdToSave').val(room.id);
    $('#roomName').val(room.name);
    $("#roomAddress").val(room.address);
    $("#roomSize").val(room.size);
    $("#roomNote").val(room.note);
    $('#roomModal').modal('show')
}

// function Room(id, name, address, size, note) {
//     this.id = id;
//     this.name = name;
//     this.address = address;
//     this.size = size;
//     this.note = note;
// }

function saveRoom() {
    // Lấy các thông số để lưu
    let id = $("#roomIdToSave").val();
    let name = $("#roomName").val();
    let address = $("#roomAddress").val();
    let size = $("#roomSize").val();
    let note = $("#roomNote").val();

    let request = {
        "name": name,
        "id": id,
        "address": address,
        "size": size,
        "note": note
    };

    let api = id ? apiClassRoom +"/update" : apiClassRoom + "/create";
    let method = id ? "PUT": "POST";
    let  message = id ? "Update thành công" : "Thêm mới thành công"

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
            $('#roomModal').modal('hide')
            showAlrtSuccess(message);
            GetListClassRooms();
        }
      });

    // let room = new Room(id, name, address, size, note);
    // classRooms.push(room);
    // fillRoomToTable();
    // --------------------- Kiểm tra id có giá trị -> call api UPDATE ROOM
    // --------------------- ko có giá trị id -> call api CREATE ROOM

    // $('#roomModal').modal('hide')
    // let text = id ? "Update thành công" : "Thêm mới thành công"
    // $('#roomModal').modal('hide')
    // showAlrtSuccess(text);
}

function resetFormEditRoom() {
    document.getElementById("roomIdToSave").value = "";
    document.getElementById("roomName").value = "";
    document.getElementById("roomAddress").value = "";
    document.getElementById("roomSize").value = "";
    document.getElementById("roomNote").value = "";
}

function confirmDeleteRoom(roomId) {
    $('#confirmDeleteRoom').modal('show')
    $('#roomIdToDelete').val(roomId)
}

function deleteRoom() {
    let roomId = document.getElementById("roomIdToDelete").value;
    console.log(roomId);
    $.ajax({
        url: apiClassRoom + "/" + roomId,
        type: "DELETE",
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem("token"));
        },
        contentType: "application/json",
        // data: JSON.stringify(request),
        error: function (err) {
          console.log(err)
          showAlrtError("Delete Không thành công");
        },
        success: function (data) {
            $('#confirmDeleteRoom').modal('hide')
            showAlrtSuccess("Xoá zoom thành công!");
            GetListClassRooms();
        }
      });

    // $('#confirmDeleteRoom').modal('hide')
    // showAlrtSuccess("Xoá phòng học thành công!");
}
