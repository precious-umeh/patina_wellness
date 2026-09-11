import Modal from "../../shared/Modal";
import SidebarContent from "./SidebarContent";

function AdminSidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile Drawer */}
      <div className="lg:hidden">
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          position="left"
          title="Admin Navigation Drawer"
          panelClassName="!w-64 max-w-none bg-surface p-0 border-r border-border"
        >
          <SidebarContent onClose={onClose} />
        </Modal>
      </div>

      {/* Desktop Sidebar */}
      <aside className="border-border bg-surface hidden w-64 border-r lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <SidebarContent onClose={() => {}} />
      </aside>
    </>
  );
}

export default AdminSidebar;
