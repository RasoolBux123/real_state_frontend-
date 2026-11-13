import Swal from "sweetalert2";

const base = {
  background: "#0f172a",
  color: "#f1f5f9",
  confirmButtonColor: "#4f46e5",
  cancelButtonColor: "#334155",
};

// Nice confirm popup. Returns true if the user pressed the confirm button.
export async function confirmDelete(title: string, text = "This cannot be undone."): Promise<boolean> {
  const res = await Swal.fire({
    ...base,
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: "Yes, delete",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#dc2626",
    reverseButtons: true,
    focusCancel: true,
  });
  return res.isConfirmed;
}

export function popupError(text: string) {
  return Swal.fire({ ...base, icon: "error", title: "Something went wrong", text });
}

// Small corner toast, disappears by itself
export function toast(title: string, icon: "success" | "error" | "info" = "success") {
  return Swal.fire({
    ...base,
    toast: true,
    position: "top-end",
    icon,
    title,
    showConfirmButton: false,
    timer: 2200,
    timerProgressBar: true,
  });
}

// Big success popup with two buttons. Resolves to true when the confirm button is pressed.
export async function successChoice(title: string, text: string, confirmText: string, cancelText: string): Promise<boolean> {
  const res = await Swal.fire({
    ...base,
    icon: "success",
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
    allowOutsideClick: false,
  });
  return res.isConfirmed;
}