import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import Button from "../../components/common/Button";
import Loader, { Spinner } from "../../components/common/Loader";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { TrashIcon } from "../../components/common/Icons";
import {
  getProductById,
  uploadProductImage,
  deleteProductImage,
} from "../../services/products.service";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [uploading, setUploading] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [deletingImage, setDeletingImage] = useState(false);

  useEffect(() => {
    loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProductById(productId);

      setProduct(data.product);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load product.");
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    // Reset the input so selecting the same file again still fires onChange
    event.target.value = "";

    if (!file) {
      return;
    }

    try {
      setUploading(true);

      await uploadProductImage(productId, file);

      // The upload response doesn't include fresh signed URLs, only
      // storage paths — so we re-fetch the product to get working
      // signed URLs for every image, including the new one.
      await loadProduct();

      showToast("Image uploaded successfully", "success");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to upload image",
        "error",
      );
    } finally {
      setUploading(false);
    }
  };

  const askDeleteImage = (imagePath) => {
    setImageToDelete(imagePath);
  };

  const closeDeleteImageDialog = () => {
    setImageToDelete(null);
  };

  const confirmDeleteImage = async () => {
    try {
      setDeletingImage(true);

      await deleteProductImage(productId, imageToDelete);
      await loadProduct();

      showToast("Image deleted successfully", "success");
    } catch (error) {
      showToast(
        error.response?.data?.message || "Failed to delete image",
        "error",
      );
    } finally {
      setDeletingImage(false);
      setImageToDelete(null);
    }
  };

  if (loading) {
    return <Loader text="Loading product..." />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-danger/30 bg-danger/10 p-6">
        <p className="text-sm font-medium text-danger">{error}</p>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Back + Title */}
      <div>
        <button
          type="button"
          onClick={() => navigate("/products")}
          className="mb-3 text-sm text-text-secondary transition hover:text-text-primary"
        >
          ← Back to Products
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-text-primary">
            {product.name}
          </h1>
          <span className="rounded-full bg-white/10 px-2.5 py-1 font-mono text-xs text-text-secondary">
            {product.key}
          </span>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              product.availability
                ? "bg-success/15 text-success"
                : "bg-danger/15 text-danger"
            }`}
          >
            {product.availability ? "Available" : "Unavailable"}
          </span>
        </div>
      </div>

      {/* Info card */}
      <section className="rounded-xl border border-border bg-surface p-6">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <div>
            <p className="text-xs font-medium text-text-secondary">
              Category
            </p>
            <p className="mt-1 text-sm text-text-primary">
              {product.category?.name || "Uncategorized"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-text-secondary">
              Total Quantity
            </p>
            <p className="mt-1 text-sm text-text-primary">
              {product.totalQty}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-text-secondary">
              Minimum Hours
            </p>
            <p className="mt-1 text-sm text-text-primary">
              {product.minHours}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-text-secondary">
              Dimensions
            </p>
            <p className="mt-1 text-sm text-text-primary">
              {product.dimensions || "—"}
            </p>
          </div>

          <div className="col-span-2 sm:col-span-4">
            <p className="text-xs font-medium text-text-secondary">
              Description
            </p>
            <p className="mt-1 text-sm text-text-primary">
              {product.description || "—"}
            </p>
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Pricing
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-background px-4 py-3">
              <p className="text-xs text-text-secondary">Hourly</p>
              <p className="mt-1 text-sm font-semibold text-text-primary">
                Rs. {product.pricing?.hourly}
              </p>
            </div>
            <div className="rounded-lg bg-background px-4 py-3">
              <p className="text-xs text-text-secondary">Half Day</p>
              <p className="mt-1 text-sm font-semibold text-text-primary">
                Rs. {product.pricing?.halfDay}
              </p>
            </div>
            <div className="rounded-lg bg-background px-4 py-3">
              <p className="text-xs text-text-secondary">Full Day</p>
              <p className="mt-1 text-sm font-semibold text-text-primary">
                Rs. {product.pricing?.fullDay}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Images */}
      <section className="rounded-xl border border-border bg-surface p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary">
            Images
          </h2>

          <Button onClick={handlePickImage} loading={uploading} size="sm">
            + Upload Image
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </div>

        {product.productImages.length === 0 ? (
          <p className="text-sm text-text-secondary">
            No images uploaded yet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {product.productImages.map((imageUrl, index) => (
              <div
                key={imageUrl}
                className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-background"
              >
                <img
                  src={imageUrl}
                  alt={`${product.name} ${index + 1}`}
                  className="h-full w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() => askDeleteImage(product.productImagePaths[index])}
                  title="Delete Image"
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-danger/90 text-white opacity-0 shadow-lg transition group-hover:opacity-100"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Delete Image Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(imageToDelete)}
        onClose={closeDeleteImageDialog}
        onConfirm={confirmDeleteImage}
        title="Delete Image"
        message="Are you sure you want to delete this image? This cannot be undone."
        confirmLabel="Delete"
        loading={deletingImage}
      />
    </div>
  );
};

export default ProductDetail;