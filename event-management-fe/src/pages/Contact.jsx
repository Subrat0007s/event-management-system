export default function Contact() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h1>
      <div className="card space-y-4">
        <p className="text-gray-600">
          Have questions or need support? Reach out to us.
        </p>
        <div>
          <p className="font-semibold text-gray-700">Email</p>
          <p className="text-blue-600">support@eventhub.com</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Phone</p>
          <p className="text-gray-600">+91 98765 43210</p>
        </div>
      </div>
    </div>
  );
}
