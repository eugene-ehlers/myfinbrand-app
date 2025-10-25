export default function Admin() {
  return (
    <section className="rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-6">
      <h1 className="text-2xl font-semibold mb-2">Admin</h1>
      <p className="opacity-80 mb-4">
        Manage users, roles, passwords, and application settings.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-[rgb(var(--border))] p-4">
          <h2 className="font-medium mb-2">Users</h2>
          <ul className="space-y-2 text-sm opacity-90">
            <li>— (placeholder)</li>
          </ul>
          <div className="mt-3 flex gap-2">
            <button className="btn-primary px-3 py-2 rounded-lg">Add User</button>
            <button className="px-3 py-2 rounded-lg border border-[rgb(var(--border))]">Invite</button>
          </div>
        </div>

        <div className="rounded-lg border border-[rgb(var(--border))] p-4">
          <h2 className="font-medium mb-2">Settings</h2>
          <div className="space-y-3 text-sm">
            <label className="block">
              <span className="block mb-1">Company name</span>
              <input className="w-full rounded-lg border border-[rgb(var(--border))] p-2" placeholder="MyFinBrand" />
            </label>
            <label className="block">
              <span className="block mb-1">Support email</span>
              <input type="email" className="w-full rounded-lg border border-[rgb(var(--border))] p-2" placeholder="support@myfinbrand.com" />
            </label>
            <button className="btn-primary px-3 py-2 rounded-lg">Save</button>
          </div>
        </div>
      </div>
    </section>
  );
}
