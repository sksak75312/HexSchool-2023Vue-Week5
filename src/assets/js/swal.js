import Swal from 'sweetalert2';

function passAlert(message) {
  return Swal.fire({
    icon: 'success',
    title: message,
    showConfirmButton: false,
    timer: 1500,
  });
}

function errorAlert(message) {
  return Swal.fire({
    icon: 'error',
    title: message,
    showConfirmButton: false,
    timer: 1500,
  });
}

function confirmAlert(message) {
  return Swal.fire({
    title: message,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: '確定',
    cancelButtonText: '取消',
  });
}

export { passAlert, errorAlert, confirmAlert };
