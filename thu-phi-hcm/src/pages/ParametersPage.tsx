import React, { useEffect, useState } from "react";

interface ParamItem {
  id?: number;
  value: string; // giaTri
  code: string;  // maTs
  name: string;  // tenTs
}

const API_BASE = 'http://10.14.122.24:8081/PHT_BE';

const ParametersPage: React.FC = () => {
  const [params, setParams] = useState<ParamItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<ParamItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState<{ code: string; name: string; value: string }>(
    { code: '', name: '', value: '' }
  );
  const [searchCode, setSearchCode] = useState('');
  const [searching, setSearching] = useState(false);

  const loadParams = async () => {
    try {
      setLoading(true);
      setError(null);
      const resp = await fetch(`${API_BASE}/api/stham-so`, { headers: { 'Cache-Control': 'no-cache' } });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const payload = await resp.json();
      const rawList = Array.isArray(payload) ? payload : (payload?.data ?? []);

      // Map trường API => UI
      const items: ParamItem[] = (rawList as any[]).map((x) => ({
        id: x.id,
        code: x.maTs,
        name: x.tenTs,
        value: x.giaTri,
      }));

      setParams(items);
    } catch (e) {
      setError((e as Error).message);
      setParams([]);
    } finally {
      setLoading(false);
    }
  };

  const searchByCode = async () => {
    const keyword = searchCode.trim();
    if (!keyword) {
      await loadParams();
      return;
    }
    try {
      setSearching(true);
      setError(null);
      setMessage(null);
      const url = `${API_BASE}/api/stham-so/by-ma?maTs=${encodeURIComponent(keyword)}`;
      const resp = await fetch(url, { headers: { 'Cache-Control': 'no-cache' } });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const payload = await resp.json();
      // payload.data có thể là object đơn hoặc mảng hoặc null
      const data = Array.isArray(payload?.data)
        ? payload.data
        : (payload?.data ? [payload.data] : []);
      const items: ParamItem[] = (data as any[]).map((x) => ({ id: x.id, code: x.maTs, name: x.tenTs, value: x.giaTri }));
      setParams(items);
    } catch (e) {
      setError((e as Error).message);
      setParams([]);
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = async () => {
    setSearchCode('');
    await loadParams();
  };

  const startEdit = (item: ParamItem) => {
    setEditing({ ...item });
    setMessage(null);
  };

  const cancelEdit = () => {
    setEditing(null);
    setSaving(false);
  };

  const saveEdit = async () => {
    if (!editing) return;
    try {
      setSaving(true);
      setMessage(null);
      const body = {
        id: editing.id ?? 0,
        maTs: editing.code,
        tenTs: editing.name,
        giaTri: editing.value,
      };
      const resp = await fetch(`${API_BASE}/api/stham-so`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const result = await resp.json().catch(() => ({}));
      setMessage(result?.message || 'Cập nhật thành công');
      setEditing(null);
      await loadParams();
    } catch (e) {
      setMessage('Lỗi lưu: ' + (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const startCreate = () => {
    setCreating(true);
    setCreateForm({ code: '', name: '', value: '' });
    setMessage(null);
  };

  const cancelCreate = () => {
    setCreating(false);
    setCreateForm({ code: '', name: '', value: '' });
  };

  const saveCreate = async () => {
    try {
      setSaving(true);
      setMessage(null);
      const body = {
        maTs: createForm.code,
        tenTs: createForm.name,
        giaTri: createForm.value,
      };
      const resp = await fetch(`${API_BASE}/api/stham-so`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const result = await resp.json();
      setMessage(result?.message || 'Tạo mới thành công');
      setCreating(false);
      setCreateForm({ code: '', name: '', value: '' });
      await loadParams();
    } catch (e) {
      setMessage('Lỗi tạo mới: ' + (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const deleteParam = async (item: ParamItem) => {
    if (!item.id) return;
    if (!window.confirm(`Xóa tham số "${item.code}"?`)) return;
    try {
      setSaving(true);
      setMessage(null);
      const resp = await fetch(`${API_BASE}/api/stham-so/${item.id}`, {
        method: 'DELETE',
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const result = await resp.json().catch(() => ({}));
      setMessage(result?.message || 'Xóa tham số thành công');
      await loadParams();
    } catch (e) {
      setMessage('Lỗi xóa: ' + (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadParams();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        {/* Title on its own line */}
        <h1 className="text-2xl font-bold text-gray-800 mb-3">Tham số hệ thống</h1>
        {/* Toolbar: left = action buttons, right = search */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {message && <span className="text-sm text-green-600 mr-2">{message}</span>}
            <button
              onClick={startCreate}
              className="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              + Thêm tham số
            </button>
            <button
              onClick={loadParams}
              className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded border border-gray-300"
            >
              Làm mới
            </button>
          </div>
          {/* Search bar */}
          <div className="flex items-center gap-2">
            <input
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { void searchByCode(); } }}
              placeholder="Nhập mã tham số..."
              className="border rounded px-3 py-2 text-sm w-56"
            />
            <button
              onClick={searchByCode}
              disabled={searching}
              className="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-50"
            >
              {searching ? 'Đang tìm...' : 'Tìm mã'}
            </button>
            <button
              onClick={clearSearch}
              className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded border border-gray-300"
            >
              Xóa lọc
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">Danh sách tham số ({params.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Mã tham số</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tên tham số</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Giá trị</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {creating && (
                <tr className="bg-blue-50">
                  <td className="px-6 py-3 text-sm">
                    <input
                      className="border rounded px-2 py-1 w-48"
                      value={createForm.code}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, code: e.target.value }))}
                      placeholder="Mã tham số"
                    />
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <input
                      className="border rounded px-2 py-1 w-64"
                      value={createForm.name}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Tên tham số"
                    />
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <input
                      className="border rounded px-2 py-1 w-64"
                      value={createForm.value}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, value: e.target.value }))}
                      placeholder="Giá trị"
                    />
                  </td>
                  <td className="px-6 py-3 text-sm text-right whitespace-nowrap">
                    <button
                      onClick={saveCreate}
                      disabled={saving}
                      className="px-3 py-1 bg-blue-600 text-white rounded mr-2 disabled:opacity-50"
                    >
                      {saving ? 'Đang lưu...' : 'Lưu'}
                    </button>
                    <button
                      onClick={cancelCreate}
                      className="px-3 py-1 bg-gray-500 text-white rounded"
                    >
                      Hủy
                    </button>
                  </td>
                </tr>
              )}

              {loading ? (
                <tr>
                  <td className="px-6 py-6 text-sm text-gray-600" colSpan={4}>
                    Đang tải...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td className="px-6 py-6 text-sm text-red-600" colSpan={4}>
                    Lỗi tải dữ liệu: {error}
                  </td>
                </tr>
              ) : params.length === 0 ? (
                <tr>
                  <td className="px-6 py-6 text-sm text-gray-500" colSpan={4}>
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                params.map((p, idx) => (
                  <tr key={p.id ?? idx} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm text-gray-800">
                      {editing?.id === p.id ? (
                        <input
                          className="border rounded px-2 py-1 w-48"
                          value={editing?.code ?? ''}
                          onChange={(e) => setEditing(prev => ({ ...(prev as ParamItem), code: e.target.value }))}
                        />
                      ) : (
                        p.code
                      )}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-800">
                      {editing?.id === p.id ? (
                        <input
                          className="border rounded px-2 py-1 w-64"
                          value={editing?.name ?? ''}
                          onChange={(e) => setEditing(prev => ({ ...(prev as ParamItem), name: e.target.value }))}
                        />
                      ) : (
                        p.name
                      )}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-800">
                      {editing?.id === p.id ? (
                        <input
                          className="border rounded px-2 py-1 w-64"
                          value={editing?.value ?? ''}
                          onChange={(e) => setEditing(prev => ({ ...(prev as ParamItem), value: e.target.value }))}
                        />
                      ) : (
                        p.value
                      )}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-800 text-right whitespace-nowrap">
                      {editing?.id === p.id ? (
                        <>
                          <button
                            onClick={saveEdit}
                            disabled={saving}
                            className="px-3 py-1 bg-blue-600 text-white rounded mr-2 disabled:opacity-50"
                          >
                            {saving ? 'Đang lưu...' : 'Lưu'}
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1 bg-gray-500 text-white rounded mr-2"
                          >
                            Hủy
                          </button>
                          <button
                            onClick={() => p.id && deleteParam(p)}
                            disabled={saving}
                            className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50"
                          >
                            Xóa
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(p)}
                            className="px-3 py-1 bg-green-600 text-white rounded mr-2"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => p.id && deleteParam(p)}
                            className="px-3 py-1 bg-red-600 text-white rounded"
                          >
                            Xóa
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ParametersPage;


