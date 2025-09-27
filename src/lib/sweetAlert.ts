import Swal from 'sweetalert2';

// Safe wrapper for SweetAlert2 to prevent DOM manipulation errors
class SafeSweetAlert {
  private static instance: SafeSweetAlert;
  private isInitialized = false;

  private constructor() {
    this.initialize();
  }

  static getInstance(): SafeSweetAlert {
    if (!SafeSweetAlert.instance) {
      SafeSweetAlert.instance = new SafeSweetAlert();
    }
    return SafeSweetAlert.instance;
  }

  private initialize() {
    if (this.isInitialized) return;
    
    // Configure SweetAlert2 to be more stable
    Swal.mixin({
      customClass: {
        popup: 'swal2-popup',
        container: 'swal2-container',
        htmlContainer: 'swal2-html-container',
        title: 'swal2-title',
        content: 'swal2-content',
        actions: 'swal2-actions',
        confirmButton: 'swal2-confirm',
        cancelButton: 'swal2-cancel',
        denyButton: 'swal2-deny',
        input: 'swal2-input',
        validationMessage: 'swal2-validation-message',
        loader: 'swal2-loader',
        footer: 'swal2-footer',
        timerProgressBar: 'swal2-timer-progress-bar',
        closeButton: 'swal2-close',
        icon: 'swal2-icon'
      },
      didOpen: () => {
        // Ensure proper DOM cleanup
        const container = document.querySelector('.swal2-container');
        if (container) {
          container.setAttribute('data-swal2-container', 'true');
        }
      },
      willClose: () => {
        // Clean up any potential DOM issues
        const container = document.querySelector('.swal2-container');
        if (container && container.parentNode) {
          try {
            container.parentNode.removeChild(container);
          } catch (e) {
            // Ignore removeChild errors
            console.warn('SweetAlert2 cleanup warning:', e);
          }
        }
      }
    });
    
    this.isInitialized = true;
  }

  async fire(options: any) {
    try {
      // Ensure we're in a clean state
      await this.cleanup();
      
      return await Swal.fire({
        ...options,
        allowOutsideClick: false,
        allowEscapeKey: true,
        focusConfirm: false,
        returnFocus: false,
        didOpen: () => {
          options.didOpen?.();
        },
        willClose: () => {
          options.willClose?.();
        }
      });
    } catch (error) {
      console.error('SweetAlert2 error:', error);
      // Fallback to browser confirm
      if (options.showCancelButton) {
        const result = window.confirm(options.text || options.title || 'Confirm action?');
        return { isConfirmed: result, isDenied: false, isDismissed: !result };
      } else {
        window.alert(options.text || options.title || 'Alert');
        return { isConfirmed: true, isDenied: false, isDismissed: false };
      }
    }
  }

  private async cleanup() {
    // Close any existing SweetAlert2 instances
    try {
      const existingContainer = document.querySelector('.swal2-container');
      if (existingContainer) {
        Swal.close();
        // Wait a bit for cleanup
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    } catch (e) {
      // Ignore cleanup errors
    }
  }

  async close() {
    try {
      await Swal.close();
    } catch (e) {
      // Ignore close errors
    }
  }
}

// Export singleton instance
export const safeSwal = SafeSweetAlert.getInstance();

// Export individual methods for convenience
export const showAlert = (options: any) => safeSwal.fire(options);
export const showConfirm = (options: any) => safeSwal.fire({
  ...options,
  showCancelButton: true,
  confirmButtonText: options.confirmButtonText || 'Yes',
  cancelButtonText: options.cancelButtonText || 'No'
});
export const showSuccess = (title: string, text?: string) => safeSwal.fire({
  title,
  text,
  icon: 'success',
  timer: 2000,
  showConfirmButton: false
});
export const showError = (title: string, text?: string) => safeSwal.fire({
  title,
  text,
  icon: 'error',
  confirmButtonText: 'OK'
});
export const showWarning = (title: string, text?: string) => safeSwal.fire({
  title,
  text,
  icon: 'warning',
  confirmButtonText: 'OK'
});
