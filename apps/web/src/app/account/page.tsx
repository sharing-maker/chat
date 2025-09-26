"use client";

import { Avatar } from "@droppii-org/ui";
import useUserStore from "@web/hook/user/useUserStore";

export default function AccountPage() {
  const { user } = useUserStore();
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tài khoản</h1>
          <p className="text-gray-600">
            Quản lý thông tin tài khoản và cài đặt
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Thông tin tài khoản</h2>

          <div className="flex flex-row gap-6 justify-between">
            <Avatar src={user?.avatarFullUrl} size={80}>
              {user?.personalInfo?.fullName?.charAt?.(0) || "A"}
            </Avatar>
            <div className="grid grid-cols-1 gap-6 flex-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên hiển thị
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={user?.personalInfo?.fullName}
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên đăng nhập
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={user?.username}
                  disabled
                />
              </div>
            </div>
          </div>

          {/* <div className="mt-6 pt-6 border-t">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Cập nhật thông tin
            </button>
          </div> */}
        </div>

        {/* <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Đổi mật khẩu</h2>

          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu mới
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Đổi mật khẩu
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
}
