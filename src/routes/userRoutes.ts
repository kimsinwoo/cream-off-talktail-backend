import { Router } from "express";
import { myRecord, pet, petDelete, petInsert, petUpdate, userInfo, userInfoUpdate } from "../controller/userController";

const router = Router();

router.get('/userinfo', userInfo)
router.put('/userinfo', userInfoUpdate)

router.get('/pet', pet)
router.post('/pet', petInsert)
router.put('/pet', petUpdate)
router.delete('/pet', petDelete)

router.get('record', myRecord)

export default router;
