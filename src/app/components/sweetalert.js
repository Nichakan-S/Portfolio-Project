import Swal from 'sweetalert2';

export const ConfirmAlert = (title, text, onConfirm) => {
  Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'ใช่, ดำเนินการ!',
    cancelButtonText: 'ยกเลิก'
  }).then((result) => {
    if (result.isConfirmed && onConfirm) {
      onConfirm();
    }
  });
};

export const WarningAlert = (title, text) => {
  Swal.fire({
    title,
    text,
    icon: 'error',
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'ตกลง'
  });
};

export const SuccessAlert = (title, text) => {
    Swal.fire({
      title,
      text,
      icon: 'success',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'ตกลง'
    });
  };