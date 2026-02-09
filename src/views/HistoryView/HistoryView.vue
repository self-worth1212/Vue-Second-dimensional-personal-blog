<!--
 * @Author: chaichai chaichai@cute.com
 * @Date: 2024-01-01 00:00:00
 * @LastEditors: chaichai chaichai@cute.com
 * @LastEditTime: 2024-01-01 00:00:00
 * @FilePath: \blog3.0\src\views\HistoryView\HistoryView.vue
 * @Description: 阅读历史页面
 * 
 * Copyright (c) 2024 by CQUCC-4-433, All Rights Reserved. 
-->
<template>
  <div class="historyBox">
    <bannerView :imgUrl="img" :titleName="title"></bannerView>
    <div class="mainBox">
      <div class="historyContainer">
        <!-- 页面标题 -->
        <div class="pageHeader">
          <h2 class="pageTitle">
            <i class="el-icon-time"></i>
            阅读历史
          </h2>
          <el-button 
            v-if="historyList.length > 0"
            type="danger" 
            size="small" 
            icon="el-icon-delete"
            @click="handleClearAll"
          >
            清空历史
          </el-button>
        </div>

        <!-- 历史列表 -->
        <div v-if="historyList.length > 0" class="historyList">
          <div 
            v-for="item in historyList" 
            :key="item.id"
            class="historyItem"
            @click="goToArticle(item)"
          >
            <!-- 文章封面 -->
            <div class="articleCover">
              <img 
                :src="item.cover || defaultCover" 
                :alt="item.title"
                @error="handleImageError"
              />
            </div>
            
            <!-- 文章信息 -->
            <div class="articleInfo">
              <h3 class="articleTitle">{{ item.title }}</h3>
              <div class="articleMeta">
                <span class="visitTime">
                  <i class="el-icon-time"></i>
                  {{ formatTime(item.visitTime) }}
                </span>
              </div>
            </div>

            <!-- 删除按钮 -->
            <div class="deleteBtn" @click.stop="handleDelete(item.id)">
              <i class="el-icon-close"></i>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="emptyState">
          <i class="el-icon-document emptyIcon"></i>
          <p class="emptyText">暂无阅读记录</p>
          <p class="emptySubText">去探索感兴趣的文章吧~</p>
          <el-button type="primary" @click="goToBlog">去阅读</el-button>
        </div>
      </div>
    </div>
    <footerView></footerView>
  </div>
</template>

<script>
import bannerView from "@/components/bannerView/index.vue";
import footerView from "@/components/footerView/index.vue";
import { 
  getReadingHistory, 
  clearHistory, 
  removeFromHistory,
  formatVisitTime 
} from "@/utils/readingHistory.js";

export default {
  name: 'HistoryView',
  components: { bannerView, footerView },
  data() {
    return {
      img: "http://chaichaiimage.oss-cn-hangzhou.aliyuncs.com/blog3.0/bg18.jpg",
      title: "阅读历史",
      historyList: [],
      defaultCover: require("@/assets/cover.jpg")
    };
  },
  mounted() {
    this.loadHistory();
  },
  activated() {
    // 页面重新激活时刷新数据
    this.loadHistory();
  },
  methods: {
    // 加载阅读历史
    loadHistory() {
      this.historyList = getReadingHistory();
    },
    
    // 格式化时间
    formatTime(isoTime) {
      return formatVisitTime(isoTime);
    },
    
    // 跳转到文章
    goToArticle(item) {
      if (item.path) {
        this.$router.push(item.path);
      } else {
        this.$message.info('该文章链接已失效');
      }
    },
    
    // 删除单条记录
    handleDelete(id) {
      this.$confirm('确定删除这条阅读记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeFromHistory(id);
        this.loadHistory();
        this.$message.success('删除成功');
      }).catch(() => {});
    },
    
    // 清空所有历史
    handleClearAll() {
      this.$confirm('确定清空所有阅读历史吗？此操作不可恢复！', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        clearHistory();
        this.loadHistory();
        this.$message.success('已清空所有阅读历史');
      }).catch(() => {});
    },
    
    // 前往博客页面
    goToBlog() {
      this.$router.push('/blog');
    },
    
    // 图片加载失败处理
    handleImageError(e) {
      e.target.src = this.defaultCover;
    }
  }
};
</script>

<style lang="scss" scoped>
.historyBox {
  min-height: 100vh;
  background: url("@/assets/cover.jpg");
  background-repeat: no-repeat;
  background-size: 500px;
  background-position: 110% 100%;
  background-attachment: fixed;

  .mainBox {
    width: 70%;
    margin: 0 auto;
    padding: 40px 0;
    min-height: 500px;
  }

  .historyContainer {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    padding: 30px;
  }

  .pageHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #ebeef5;

    .pageTitle {
      font-size: 24px;
      color: #303133;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 10px;

      i {
        color: #409eff;
      }
    }
  }

  .historyList {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .historyItem {
    display: flex;
    align-items: center;
    padding: 15px;
    background: #f5f7fa;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;

    &:hover {
      background: #ecf5ff;
      transform: translateX(5px);
      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);

      .deleteBtn {
        opacity: 1;
      }
    }
  }

  .articleCover {
    width: 120px;
    height: 80px;
    border-radius: 6px;
    overflow: hidden;
    flex-shrink: 0;
    margin-right: 20px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    &:hover img {
      transform: scale(1.05);
    }
  }

  .articleInfo {
    flex: 1;
    min-width: 0;

    .articleTitle {
      font-size: 18px;
      color: #303133;
      margin: 0 0 10px 0;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .articleMeta {
      display: flex;
      align-items: center;
      gap: 15px;

      .visitTime {
        font-size: 14px;
        color: #909399;
        display: flex;
        align-items: center;
        gap: 5px;
      }
    }
  }

  .deleteBtn {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #f56c6c;
    color: #fff;
    cursor: pointer;
    opacity: 0;
    transition: all 0.3s ease;
    margin-left: 15px;

    &:hover {
      background: #f78989;
      transform: scale(1.1);
    }

    i {
      font-size: 14px;
    }
  }

  .emptyState {
    text-align: center;
    padding: 80px 20px;

    .emptyIcon {
      font-size: 80px;
      color: #dcdfe6;
      margin-bottom: 20px;
    }

    .emptyText {
      font-size: 18px;
      color: #606266;
      margin: 0 0 10px 0;
    }

    .emptySubText {
      font-size: 14px;
      color: #909399;
      margin: 0 0 30px 0;
    }
  }
}

// 响应式适配
@media screen and (max-width: 768px) {
  .historyBox {
    .mainBox {
      width: 90%;
      padding: 20px 0;
    }

    .historyContainer {
      padding: 20px;
    }

    .pageHeader {
      flex-direction: column;
      gap: 15px;
      align-items: flex-start;

      .pageTitle {
        font-size: 20px;
      }
    }

    .historyItem {
      padding: 12px;

      &:hover {
        transform: none;
      }
    }

    .articleCover {
      width: 80px;
      height: 60px;
      margin-right: 15px;
    }

    .articleInfo {
      .articleTitle {
        font-size: 15px;
      }

      .articleMeta {
        .visitTime {
          font-size: 12px;
        }
      }
    }

    .deleteBtn {
      opacity: 1;
      width: 28px;
      height: 28px;
    }
  }
}
</style>
