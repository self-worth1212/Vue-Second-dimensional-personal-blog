<template>
  <div class="historyBox">
    <bannerView :imgUrl="img" :titleName="title"></bannerView>
    <div class="mainBox">
      <div class="headerBox">
        <h2 class="historyTitle">阅读历史</h2>
        <el-button 
          type="danger" 
          icon="el-icon-delete" 
          @click="clearAllHistory"
          :disabled="history.length === 0"
        >
          清空历史
        </el-button>
      </div>
      
      <div v-if="history.length === 0" class="emptyBox">
        <p class="emptyText">暂无阅读历史</p>
      </div>
      
      <div v-else class="historyList">
        <div 
          v-for="(item, index) in history" 
          :key="index"
          class="historyItem"
          @click="goToArticle(item)"
        >
          <div class="itemCover">
            <img :src="item.cover" alt="文章封面" class="coverImg">
          </div>
          <div class="itemInfo">
            <h3 class="itemTitle">{{ item.title }}</h3>
            <p class="visitedTime">访问时间：{{ formatTime(item.visitedAt) }}</p>
          </div>
        </div>
      </div>
    </div>
    <footerView></footerView>
  </div>
</template>

<script>
import bannerView from "@/components/bannerView/index.vue";
import footerView from "@/components/footerView/index.vue";
import { useReadingHistoryStore } from "@/stores/readingHistory";

export default {
  name: 'HistoryView',
  components: { bannerView, footerView },
  data() {
    return {
      img: "http://chaichaiimage.oss-cn-hangzhou.aliyuncs.com/blog3.0/bg17.jpg",
      title: "阅读历史",
    };
  },
  computed: {
    history() {
      return this.readingHistoryStore.history;
    }
  },
  setup() {
    const readingHistoryStore = useReadingHistoryStore();
    readingHistoryStore.loadHistory();
    
    return {
      readingHistoryStore
    };
  },
  methods: {
    formatTime(timeStr) {
      const date = new Date(timeStr);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    goToArticle(article) {
      // 这里需要根据实际路由跳转逻辑修改
      this.$router.push({ name: 'blog', params: { id: article.id } });
    },
    clearAllHistory() {
      this.readingHistoryStore.clearHistory();
      this.$message.success('阅读历史已清空');
    }
  }
};
</script>

<style lang="scss" scoped>
.historyBox {
  min-height: 100vh;
  background: url("@/assets/cover.jpg") no-repeat fixed 110% 100% / 500px;
}

.mainBox {
  width: 70%;
  margin: 20px auto;
}

.headerBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.historyTitle {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.emptyBox {
  text-align: center;
  padding: 60px 0;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.emptyText {
  font-size: 18px;
  color: #999;
}

.historyList {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.historyItem {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  }
}

.itemCover {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.coverImg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  .historyItem:hover & {
    transform: scale(1.05);
  }
}

.itemInfo {
  padding: 16px;
}

.itemTitle {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.visitedTime {
  font-size: 14px;
  color: #666;
}

/* 暗黑模式适配 */
@media (prefers-color-scheme: dark) {
  .historyTitle {
    color: #fff;
  }
  
  .emptyBox {
    background: rgba(30, 30, 30, 0.8);
  }
  
  .emptyText {
    color: #ccc;
  }
  
  .historyItem {
    background: rgba(30, 30, 30, 0.8);
  }
  
  .itemTitle {
    color: #fff;
  }
  
  .visitedTime {
    color: #999;
  }
}
</style>