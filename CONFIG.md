# 配置文件说明

## 配置文件位置

`config/index.ts` - 应用主配置文件

## 配置项说明

### 高德地图配置

```typescript
amap: {
  key: '95b533dc58b44f3cbae93cd9efff0858',        // 高德地图 API Key
  secret: '6171dc6a7993ecde4079b2646d36f5bb',     // 高德地图安全密钥
  version: '2.0'                                   // 高德地图 API 版本
}
```

### SQLite3 数据库配置

```typescript
database: {
  filename: 'trip_planner.db',                     // 数据库文件名
  directory: './data'                              // 数据库存储目录
}
```

### 应用配置

```typescript
app: {
  name: '我的线路',                                // 应用名称
  version: '1.0.0',                               // 应用版本
  primaryColor: '#0ABFC5'                         // 主题色
}
```

## 文件结构

```
项目根目录/
├── config/
│   └── index.ts              # 主配置文件
├── data/                     # SQLite3 数据库目录
│   └── trip_planner.db       # 数据库文件
└── ...
```

## 使用方式

### 在代码中引用配置

```typescript
import { config } from "~/config";

// 使用高德地图配置
const amapKey = config.amap.key;

// 使用数据库配置
const dbPath = path.join(config.database.directory, config.database.filename);
```

### 修改配置

直接编辑 `config/index.ts` 文件中的相应值即可。

## 注意事项

1. **高德地图 Key**：请确保使用有效的高德地图 API Key
2. **数据库目录**：确保应用有权限在指定目录创建和写入文件
3. **配置更新**：修改配置后需要重启开发服务器
