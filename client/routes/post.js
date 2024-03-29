const express = require('express');
const router = express.Router();
const { boardController, noticeController } = require('../controllers/postController');

// 라우트 수행
router.get('/community', boardController.showList);
router.get('/community/delete/:post_num', boardController.deletePost);
router.get('/community/insert', boardController.showInsertForm);
router.post('/community/insert', boardController.insertPost);
router.get('/community/edit/:post_num', boardController.showEditForm); // 편집 폼
router.post('/community/edit/:post_num', boardController.updatePost);
router.get('/notice', noticeController.showManagerPosts);
router.get('/notice/show/:post_num', noticeController.showForm);

module.exports = router;
