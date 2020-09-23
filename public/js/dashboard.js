$('.delete-button').click((e) => {
    const pollParent = e.target.parentElement.parentElement;
    const pollID = e.target.value;
    Swal.fire({
        title: 'هل انت متأكد',
        text: "لا تستطيع التراجع عن هذا القرار",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#00bfd8',
        cancelButtonColor: '#d33',
        heightAuto: false,
        confirmButtonText: 'متأكد',
        cancelButtonText: 'تراجع'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/${pollID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => {
                if (res.status == 200) {
                    Swal.fire({
                        icon: 'success',
                        text: 'تم حذف التصويت',
                        timer: 1500,
                        heightAuto: false,
                        showConfirmButton: false,
                    });
                    pollParent.remove();
                }
                else {
                    errorAlert('مشكلة في السيرفر', 500);
                }
            })
        }
    })
});

$('.info-button').click((e) => {
    const options = JSON.parse(e.target.value);
    console.log("options", options)
    let msg = "";

    if (options.hidden == 0) {
        msg += "<li>إظهار النتائج للجميع</li>"
    }
    else if (options.hidden == 1) {
        msg += "<li>إظهار النتائج بعد التصويت</li>"
    }
    else if (options.hidden == 2) {
        msg += "<li>إخفاء النتائج للجميع</li>"
    }

    if (options.ipAddress) {
        msg += "<li>تصويت واحد لكل شبكة</li>"
    }
    else {
        msg += "<li>يمكن إعادة التصويت من نفس الشبكة</li>"
    }
    if (options.question) {
        msg += "<li>يوجد سؤال عند التصويت</li>"
    } else {
        msg += "<li>لا يوجد سؤال عند التصويت</li>"
    }
    if (options.vpn) {
        msg += "<li> لا يسمح لـ VPN بتصويت</li>"
    } else {
        msg += "<li>  يسمح لـ VPN بتصويت</li>"
    }
    console.log('msg', msg)
    Swal.fire({
        icon: 'info',
        heightAuto: false,
        html: `<ul style="direction:rtl;" class="text-right">${msg}</ul>`,
        confirmButtonText: 'التأكيد',
        confirmButtonColor: '#00bfd8',
    });
});