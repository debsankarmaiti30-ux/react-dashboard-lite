import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { HardDrive, Files, TrendingUp, Database } from "lucide-react";

export default function StorageSection() {
  const stats = useQuery(api.files.getStorageStats);
  const files = useQuery(api.files.getUserFiles) || [];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Mock storage limit (in real app, this would come from user plan)
  const storageLimit = 1024 * 1024 * 1024; // 1GB
  const usedStorage = stats?.totalSize || 0;
  const storagePercentage = (usedStorage / storageLimit) * 100;

  // File type breakdown
  const fileTypes = files.reduce((acc, file) => {
    const category = file.type.split('/')[0] || 'other';
    acc[category] = (acc[category] || 0) + file.size;
    return acc;
  }, {} as Record<string, number>);

  const typeColors = {
    image: "bg-blue-500",
    video: "bg-purple-500", 
    audio: "bg-green-500",
    application: "bg-orange-500",
    text: "bg-red-500",
    other: "bg-gray-500"
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Storage Overview</h1>
        <p className="text-muted-foreground mt-2">
          Monitor your storage usage and file distribution
        </p>
      </div>

      {/* Storage Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Files</CardTitle>
              <Files className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalFiles || 0}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Used Storage</CardTitle>
              <HardDrive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatFileSize(usedStorage)}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatFileSize(storageLimit - usedStorage)}</div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usage</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{storagePercentage.toFixed(1)}%</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Storage Usage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Storage Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>{formatFileSize(usedStorage)} used</span>
                <span>{formatFileSize(storageLimit)} total</span>
              </div>
              <Progress value={storagePercentage} className="h-2" />
            </div>
            
            {storagePercentage > 80 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-800">
                  You're running low on storage space. Consider upgrading your plan or removing unused files.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* File Type Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>File Type Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(fileTypes).length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No files uploaded yet
              </p>
            ) : (
              <div className="space-y-4">
                {Object.entries(fileTypes).map(([type, size]) => {
                  const percentage = (size / usedStorage) * 100;
                  const colorClass = typeColors[type as keyof typeof typeColors] || typeColors.other;
                  
                  return (
                    <div key={type} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{type} files</span>
                        <span>{formatFileSize(size)} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${colorClass}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
