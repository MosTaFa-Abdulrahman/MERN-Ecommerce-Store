import { useState } from "react";
import { makeRequest } from "../../requestMethod";
import { toast } from "react-toastify";
import useGetAllCategories from "../../hooks/admin/useGetAllCategories";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";
import CategoryForm from "../../components/CategoryForm";

function CategoryList() {
  const { categories } = useGetAllCategories();

  const [name, setName] = useState("");

  const [updatingName, setUpdatingName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Create
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      !name && toast.warning(`Please Enter Category Name 😊`);

      await makeRequest.post("/category/create", { name });
      setName("");
      toast.success(`Category Created Success 😍`);
      window.location.reload();
    } catch (error) {
      toast.error(`${error.message} 😥`);
    }
  };

  // Update
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      !updatingName && toast.warning(`Please Enter Category Name 😊`);

      await makeRequest.put(`/category/update/${selectedCategory._id}`, {
        name: updatingName,
      });
      toast.success(`Category Updated Success 😍`);
      setSelectedCategory(null);
      setUpdatingName("");
      setModalVisible(false);
      window.location.reload();
    } catch (error) {
      toast.error(`${error.message} 😥`);
    }
  };

  // Delete
  const handleDeleteCategory = async (e) => {
    e.preventDefault();
    try {
      await makeRequest.delete(`/category/delete/${selectedCategory._id}`);
      toast.success(`Category Deleted Success 😍`);
      setSelectedCategory(null);
      setModalVisible(false);
      window.location.reload();
    } catch (error) {
      toast.error(`${error.message} 😥`);
    }
  };

  return (
    <div className="ml-[10rem] flex flex-col md:flex-row">
      <AdminMenu />

      <div className="md:w-3/4 p-3">
        <div className="h-12">Manage Categories</div>
        <CategoryForm
          value={name}
          setValue={setName}
          handleSubmit={handleCreateCategory}
        />
        <br />
        <hr />

        <div className="flex flex-wrap">
          {categories?.map((category) => (
            <div key={category._id}>
              <button
                className="bg-white border border-pink-500 text-pink-500 py-2 px-4 rounded-lg m-3 hover:bg-pink-500 hover:text-white focus:outline-none foucs:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                onClick={() => {
                  {
                    setModalVisible(true);
                    setSelectedCategory(category);
                    setUpdatingName(category.name);
                  }
                }}
              >
                {category.name}
              </button>
            </div>
          ))}
        </div>

        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <CategoryForm
            value={updatingName}
            setValue={(value) => setUpdatingName(value)}
            handleSubmit={handleUpdateCategory}
            buttonText="Update"
            handleDelete={handleDeleteCategory}
          />
        </Modal>
      </div>
    </div>
  );
}

export default CategoryList;
