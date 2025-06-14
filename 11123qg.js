var ZiXingTi = "选择词语的正确词形。"; //字形题
var DuYinTi = "选择正确的读音。"; //读音题 20201211
var ErShiSiShi = "下列不属于二十四史的是。"; //二十四史
var customize_flag = false; //自定义运行标志


// ... 已有代码 ...
// main
while (true) {
    if (text("1 /5").findOne(20)) {
        break;
    }
    if (text("查看提示").findOne(20)) {
        break;
    }
    sleep(100)
}
while (true) {
    if (text("下一题").exists()) { //专项答题
        text("下一题").click();
        sleep(200); //随机延时0.5-1秒
    }
    if (text("icon/24/icon_Y_shuaxin").exists()) {
        log("网络错误")
        break;
    }
    if (textStartsWith("本次答对题目数").exists()) {
        log("答完了")
        break;
    }
    dailyQuestionLoop()
    sleep(1000)
}
// huoquwenben?“风声雨声
// 22:20:05.738/D: nihao nihao |3
// 22:20:05.742/D: huoquwenben?“风声雨声,|3,声声入耳，家事国事天下事事事关心”是明代学者顾宪成撰写的。这副心怀远大抱负之名联，至今仍悬挂在东林书院依庸堂内。
// 22:20:05.748/D: huoquwenben?111122“风声雨声,|3,声声入耳，家事国事天下事事事关心”是明代学者顾宪成撰写的。这副心怀远大抱负之名联，至今仍悬挂在东林书院依庸堂内。
// 22:20:05.859/D: 填空题目：“风声雨声声声入耳，家事国事天下事事事关心”是明代学者顾宪成撰写的。这副心怀远大抱负之名联，至今仍悬挂在东林书院依庸堂内。
// 22:20:06.505/D: 获取提示里的文本 ： 东林书院创建于北宋政和元年即公元1111年，是北宋学者杨时长期讲学的地方。明朝万历三十二年，也就是公元1604年，由东林学者顾宪成等人重兴修复并在此聚众讲学。顾宪成曾撰有“风声雨声读书声声声入耳，家事国事天下事事事关心”的名联，后被广为传诵。
// 22:20:06.515/D: 1199:为传诵
// 22:20:06.518/I: 提示填空答案：为传诵
function extractMissingWords对比错字(questionArray, tipsStr, sentence) {
    let missingWords = [];
    const correctWordMatch = tipsStr.match(/【([^】]+)/);
    if (!correctWordMatch) return missingWords;
    const correctWord = correctWordMatch[1];
    console.log("正确词11:", correctWord);
    // 提取实际句子并预处理
    const sentenceStart = sentence.indexOf('“') + 1;
    const sentenceEnd = sentence.lastIndexOf('”');
    const rawSentence = sentence.slice(sentenceStart, sentenceEnd);
    // 预处理：生成纯文字版本用于匹配
    const preprocessedSentence = rawSentence.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '');
    const preprocessedCorrect = correctWord.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '');
    // 动态计算匹配阈值（至少匹配50%的字符）
    const minMatchThreshold = Math.ceil(preprocessedCorrect.length * 0.5);
    let bestMatchIndex = -1;
    let maxMatchCount = 0;
    // 滑动窗口匹配
    for (let i = 0; i <= preprocessedSentence.length - preprocessedCorrect.length; i++) {
        let matchCount = 0;
        for (let j = 0; j < preprocessedCorrect.length; j++) {
            if (preprocessedSentence[i + j] === preprocessedCorrect[j]) {
                matchCount++;
            }
        }
        if (matchCount > maxMatchCount && matchCount >= minMatchThreshold) {
            maxMatchCount = matchCount;
            bestMatchIndex = i;
        }
    }
    // 映射回原始位置
    let rawPos = 0;
    let preprocessedPos = 0;
    while (preprocessedPos < bestMatchIndex && rawPos < rawSentence.length) {
        if (/[a-zA-Z0-9\u4e00-\u9fa5]/.test(rawSentence[rawPos])) {
            preprocessedPos++;
        }
        rawPos++;
    }
    // 执行逐字比对
    let correctPointer = 0;
    while (rawPos < rawSentence.length && correctPointer < correctWord.length) {
        // 跳过非文字字符
        if (!/[a-zA-Z0-9\u4e00-\u9fa5]/.test(rawSentence[rawPos])) {
            rawPos++;
            continue;
        }
        if (rawSentence[rawPos] !== correctWord[correctPointer]) {
            missingWords.push(rawSentence[rawPos]);
            missingWords.push(correctWord[correctPointer]);
            break;
        }
        rawPos++;
        correctPointer++;
    }
    console.log("校正结果:", missingWords);
    return missingWords;
}
// function extractMissingWords1(questionArray, tipsStr,sentence) {//可用，但有问题
//     //处理后的填空题目：根据我国宪法，国家加强武装力量的革命化、,|3,、正规化的建设，增强国防力量。flag1
//     //获取提示里的文本 ： 《中华人民共和国宪法》第二十九条第二款规定，国家加强武装力量的革命化、现代化、正规化的建设，增强国防力量。
//     //最终提取的缺失词语为:["现代化"]
//     if(sentence.includes('错别字')){
//         return extractMissingWords对比错字(questionArray, tipsStr, sentence);
//     }
//     tipsStr = tipsStr.replace(/\s+/g, ' ').trim();
//     tipsStr = tipsStr.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, '');
//     console.log("预处理后的提示字符串:", tipsStr);
//     let missingWords = [];
//     let searchIndex = 0;
//     const hasBlank = questionArray.some(item => item.startsWith('|'));
//     if (hasBlank) {

//         // 遍历 questionArray，从第二个元素开始，到倒数第二个元素结束
//         // for (let i = 1; i < questionArray.length - 1; i++) {
//         //     const currentItem = questionArray[i];
//         //     // 检查当前元素是否为空缺标识
//         //     if (currentItem.startsWith('|')) {
//         //         // 提取空缺长度
//         //         const blankLength = parseInt(currentItem.slice(1), 10);
//         //         // 处理无法解析空缺长度的情况
//         //         if (isNaN(blankLength)) {
//         //             console.log(`无法解析空缺长度，当前元素: ${currentItem}`);
//         //             continue;
//         //         }
//         //         // 获取下一个非空缺元素作为关键字
//         //         const keyword = questionArray[i + 1];
//         //         // 在提示字符串中查找关键字的起始索引
//         //         const keywordIndex = tipsStr.indexOf(keyword, searchIndex);
//         //         // 若未找到关键字则跳过
//         //         if (keywordIndex === -1) {
//         //             console.log(`未在提示字符串中找到关键字: ${keyword}`);
//         //             continue;
//         //         }
//         //         // 计算缺失词语的起始索引
//         //         const startIndex = Math.max(0, keywordIndex - blankLength);
//         //         // 提取缺失词语
//         //         const missingWord = tipsStr.slice(startIndex, keywordIndex);
//         //         missingWords.push(missingWord);
//         //         // 更新下一次查找的起始索引
//         //         searchIndex = keywordIndex + keyword.length;
//         //     }
//         // }
//     } else {
//         // 预处理题目文本，
//         const questionText = questionArray.join('').replace(/\s+/g, ' ').trim().replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, '');
//         console.log("预处理后的题目文本:", questionText);
//         let tipIndex = 0;
//         let questionIndex = 0;
//         while (tipIndex < tipsStr.length && questionIndex < questionText.length) {
//             if (tipsStr[tipIndex] === questionText[questionIndex]) {
//                 tipIndex++;
//                 questionIndex++;
//             } else {
//                 // 将声明移到代码块内避免重复声明
//                 let localMissingWord = ''; 
//                 while (tipIndex < tipsStr.length && (questionIndex >= questionText.length || tipsStr[tipIndex] !== questionText[questionIndex])) {
//                     localMissingWord += tipsStr[tipIndex];
//                     tipIndex++;
//                 }
//                 missingWords.push(localMissingWord);
//             }
//         }
//         // 处理提示文本剩余部分
//         if (tipIndex < tipsStr.length) {
//             // 将声明移到代码块内避免重复声明
//             const localMissingWord = tipsStr.slice(tipIndex); 
//             missingWords.push(localMissingWord);
//         }
//     }
//     /*
//     // 遍历 questionArray，从第二个元素开始，到倒数第二个元素结束
//     for (let i = 1; i < questionArray.length - 1; i++) {
//         const currentItem = questionArray[i];
//         // 检查当前元素是否为空缺标识
//         if (currentItem.startsWith('|')) {
//             // 提取空缺长度
//             const blankLength = parseInt(currentItem.slice(1), 10);
//             // 处理无法解析空缺长度的情况
//             if (isNaN(blankLength)) {
//                 console.log(`无法解析空缺长度，当前元素: ${currentItem}`);
//                 continue;
//             }
//             // 获取下一个非空缺元素作为关键字，也就是“正规化”的正
//             const keyword = questionArray[i + 1];
//             // 在提示字符串中查找关键字的起始索引
//             const keywordIndex = tipsStr.indexOf(keyword, searchIndex);//在提示字符串中查找关键字“正”的起始索引
//             // 若未找到关键字则跳过
//             if (keywordIndex === -1) {
//                 console.log(`未在提示字符串中找到关键字: ${keyword}`);
//                 continue;
//             }
//             // 计算缺失词语的起始索引
//             const startIndex = Math.max(0, keywordIndex - blankLength);//从0到  关键字“正” 减去空白长度3的索引，也就是“化”的索引
//             // 提取缺失词语
//             const missingWord = tipsStr.slice(startIndex, keywordIndex);//从startIndex到keywordIndex的部分，也就是“化”到“正”之间的部分
//             missingWords.push(missingWord);
//             // 更新下一次查找的起始索引
//             searchIndex = keywordIndex + keyword.length;
//         }
//     }*/
//     console.log("最终提取的缺失词语为:" + JSON.stringify(missingWords));
//     return missingWords;
// }
// function extractMissingWords(questionArray, tipsStr) {
//     console.log("原始题目数组:", questionArray);
//     console.log("原始提示字符串:", tipsStr);
//     // 预处理提示文本，去除多余空格、换行符和特殊字符
//     tipsStr = tipsStr.replace(/\s+/g, ' ').trim();
//     tipsStr = tipsStr.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, '');
//     console.log("预处理后的提示字符串:", tipsStr);

//     let missingWords = [];
//     let lastMatchedIndex = 0; // 记录上一次匹配到的提示文本位置
//     const minSimilarity = 0.3; // 最小相似度阈值

//     for (let i = 0; i < questionArray.length; i++) {
//         const currentItem = questionArray[i];
//         if (/^\d+$/.test(currentItem)) {
//             // 假设当前元素是空缺长度
//             const blankLength = parseInt(currentItem, 10);
//             // 获取空缺标识前的参考文本，取最后 50 个字符
//             let referenceText = questionArray.slice(0, i).join('').slice(-50);
//             // 清理参考文本中的特殊字符
//             referenceText = referenceText.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, '');
//             console.log(`使用的参考文本（清理后）: ${referenceText}`);

//             if (!referenceText) {
//                 console.log("参考文本为空，跳过此次提取");
//                 continue;
//             }

//             // 滑动窗口匹配，计算字符相似度
//             let bestMatchIndex = -1;
//             let maxSimilarity = 0;
//             const refLen = referenceText.length;

//             for (let j = lastMatchedIndex; j <= tipsStr.length - refLen; j++) {
//                 let matchCount = 0;
//                 for (let k = 0; k < refLen; k++) {
//                     if (tipsStr[j + k] === referenceText[k]) {
//                         matchCount++;
//                     }
//                 }
//                 const similarity = matchCount / refLen;
//                 if (similarity > maxSimilarity && similarity >= minSimilarity) {
//                     maxSimilarity = similarity;
//                     bestMatchIndex = j;
//                 }
//             }

//             if (bestMatchIndex !== -1) {
//                 console.log(`找到参考文本的位置: ${bestMatchIndex}，相似度: ${maxSimilarity}`);
//                 // 计算缺失词语的起始索引
//                 const startIndex = bestMatchIndex + refLen;
//                 // 提取缺失词语，同时避免越界
//                 const endIndex = Math.min(startIndex + blankLength, tipsStr.length);
//                 const missingWord = tipsStr.slice(startIndex, endIndex);
//                 missingWords.push(missingWord);
//                 console.log(`提取缺失词: ${missingWord}`);
//                 // 更新上一次匹配到的位置
//                 lastMatchedIndex = endIndex;
//             } else {
//                 console.log(`未在提示字符串中找到足够相似的参考文本: ${referenceText}`);
//             }
//         }
//     }

//     console.log("最终提取的缺失词语为:", missingWords);
//     return missingWords;
// }

// function extractMissingWords3(questionArray, tipsStr, sentence) {//原版的3
//     if(sentence.includes('错别字')){
//         return extractMissingWords对比错字(questionArray, tipsStr, sentence);
//     }
//     // 将题目数组拼接成完整的题目字符串
//     let question = questionArray.join('');
//     // 预处理：生成纯文字版本的题目和提示用于匹配
//     let preprocessedQuestion = question.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '');
//     let preprocessedTips = tipsStr.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '');
//     console.log("预处理后的题目：" + preprocessedQuestion);
//     console.log("预处理后的提示：" + preprocessedTips);

//     let missingWords = [];
//     let blankIndices = [];

//     // 找出所有空缺标识的位置
//     for (let i = 0; i < questionArray.length; i++) {
//         if (questionArray[i].startsWith('|')) {
//             blankIndices.push(i);
//         }
//     }

//     // 处理每个空缺
//     for (let j = 0; j < blankIndices.length; j++) {
//         let blankIndex = blankIndices[j];
//         // 找到空缺前的参考文本，取最后 10 个字符
//         let prevText = questionArray.slice(0, blankIndex).join('').replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '').slice(-10);
//         // 找到空缺后的参考文本，取前 10 个字符
//         let nextText = questionArray.slice(blankIndex + 1).join('').replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '').slice(0, 10);

//         // 如果是最后一个空缺，将 nextText 设为空字符串
//         if (j === blankIndices.length - 1) {
//             nextText = "";
//         }

//         // 在提示文本中查找前参考文本的结束位置
//         let prevIndex = preprocessedTips.indexOf(prevText);
//         if (prevIndex !== -1) {
//             prevIndex += prevText.length;
//         }

//         // 在提示文本中查找后参考文本的开始位置
//         let nextIndex;
//         if (nextText) {
//             nextIndex = preprocessedTips.indexOf(nextText, prevIndex);
//         } else {
//             // 如果 nextText 为空，缺失词为 prevIndex 到提示文本末尾
//             nextIndex = preprocessedTips.length;
//         }

//         // 提取缺失词
//         if (prevIndex !== -1) {
//             let missingWord = preprocessedTips.slice(prevIndex, nextIndex);
//             missingWords.push(missingWord);
//         }
//     }

//     console.log("最终提取的缺失词语为:", missingWords);
//     return missingWords;
// }
function extractMissingWords(questionArray, tipsStr, sentence) {
    //处理后的填空题目：根据我国宪法，国家加强武装力量的革命化、,|3,、正规化的建设，增强国防力量。flag1
    //获取提示里的文本 ： 《中华人民共和国宪法》第二十九条第二款规定，国家加强武装力量的革命化、现代化、正规化的建设，增强国防力量。
    //最终提取的缺失词语为:["现代化"]
    if(sentence.includes('错别字')){
        return extractMissingWords对比错字(questionArray, tipsStr, sentence);
    }
    tipsStr = tipsStr.replace(/\s+/g, ' ').trim();
    tipsStr = tipsStr.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, '');
    const questionText = questionArray.join('').replace(/\s+/g, ' ').trim().replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, '');
    console.log("预处理后的题目文本:", questionText);
    console.log("预处理后的提示字符串:", tipsStr);
    let missingWords = [];
    let searchIndex = 0;
    const hasBlank = questionArray.some(item => item.startsWith('|'));
    if (hasBlank) {
        // 正则匹配空格长度标识（如 |4 或 4 这种形式）
        const blankRegex = /(\d+)(?=[\u4e00-\u9fa5a-zA-Z])/g;
        let match;
        while ((match = blankRegex.exec(questionText)) !== null) {
            const blankLength = parseInt(match[1], 10);
            const index = match.index;
            // 取空格长度前面的 3 个文字
            const prevText = questionText.slice(Math.max(0, index - 3), index);
            // 取空格长度后面的 3 个文字
            const nextText = questionText.slice(index + match[1].length, index + match[1].length + 3);
            // 在提示里查找前后参考文字的位置
            const prevIndex = tipsStr.indexOf(prevText);
            const nextIndex = tipsStr.indexOf(nextText);
            let start; 
            let missingWord; 
            if (prevIndex !== -1 && nextIndex !== -1) {
                // 提取答案
                start = prevIndex + prevText.length;
                missingWord = tipsStr.slice(start, nextIndex);
                missingWords.push(missingWord);
            } else if (prevIndex !== -1) {
                // 若后参考文字未找到，按空格长度提取
                start = prevIndex + prevText.length;
                const end = start + blankLength;
                missingWord = tipsStr.slice(start, end);
                missingWords.push(missingWord);
            } else if (nextIndex !== -1) {
                // 当前参考文字未找到，而后参考文字找到时
                start = Math.max(0, nextIndex - blankLength);
                missingWord = tipsStr.slice(start, nextIndex);
                missingWords.push(missingWord);
            }
        }
        // console.log("最终提取的缺失词语为:", missingWords);
        // return missingWords;
    } else {
        let tipIndex = 0;
        let questionIndex = 0;
        while (tipIndex < tipsStr.length && questionIndex < questionText.length) {
            if (tipsStr[tipIndex] === questionText[questionIndex]) {
                tipIndex++;
                questionIndex++;
            } else {
                // 将声明移到代码块内避免重复声明
                let localMissingWord = ''; 
                while (tipIndex < tipsStr.length && (questionIndex >= questionText.length || tipsStr[tipIndex] !== questionText[questionIndex])) {
                    localMissingWord += tipsStr[tipIndex];
                    tipIndex++;
                }
                missingWords.push(localMissingWord);
            }
        }
        // 处理提示文本剩余部分
        if (tipIndex < tipsStr.length) {
            // 将声明移到代码块内避免重复声明
            const localMissingWord = tipsStr.slice(tipIndex); 
            missingWords.push(localMissingWord);
        }
    }
    console.log("最终提取的缺失词语为:" + JSON.stringify(missingWords));
    return missingWords;
}
function extractMissingWords3(questionArray, tipsStr, sentence) {
    if(sentence.includes('错别字')){
        return extractMissingWords对比错字(questionArray, tipsStr, sentence);
    }
    // 将题目数组拼接成完整的题目字符串
    let question = questionArray.join('');
    // 预处理：生成纯文字版本的题目和提示用于匹配
    let preprocessedQuestion = question.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '');
    let preprocessedTips = tipsStr.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '');
    console.log("预处理后的题目：" + preprocessedQuestion);
    console.log("预处理后的提示：" + preprocessedTips);
    let missingWords = [];
    let blankIndices = [];
    // 正则匹配空格长度标识（如 9 这种形式）
    const blankRegex = /(\d+)(?=[\u4e00-\u9fa5a-zA-Z])/g;
    let match;
    while ((match = blankRegex.exec(question)) !== null) {
        const blankLength = parseInt(match[1], 10);
        const index = match.index;
        // 找到空格长度标识在 questionArray 中的大致位置
        let arrayIndex = 0;
        let currentLength = 0;
        while (currentLength + questionArray[arrayIndex].length <= index) {
            currentLength += questionArray[arrayIndex].length;
            arrayIndex++;
        }
        blankIndices.push({ index: arrayIndex, type: 'number', length: blankLength });
    }
    // 处理 | 作为空缺标识的情况
    for (let i = 0; i < questionArray.length; i++) {
        if (questionArray[i].startsWith('|')) {
            blankIndices.push({ index: i, type: 'pipe' });
        }
    }
    // 处理单纯空格作为空缺的情况
    const spaceRegex = /\s+/g;
    while ((match = spaceRegex.exec(question)) !== null) {
        // 找到空格在 questionArray 中的大致位置
        let arrayIndex = 0;
        let currentLength = 0;
        while (currentLength + questionArray[arrayIndex].length <= match.index) {
            currentLength += questionArray[arrayIndex].length;
            arrayIndex++;
        }
        blankIndices.push({ index: arrayIndex, type: 'space', length: match[0].length });
    }
    // 对空缺标识按索引排序
    blankIndices.sort((a, b) => a.index - b.index);
    let lastMatchedIndex = 0; // 记录上一次匹配结束的位置
    // 处理每个空缺
    for (let j = 0; j < blankIndices.length; j++) {
        let blankInfo = blankIndices[j];
        let blankIndex = blankInfo.index;
        // 进一步缩小参考文本长度，取最后 3 个字符作为前参考文本
        let prevText = questionArray.slice(0, blankIndex).join('').replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '').slice(-3);
        // 取前 3 个字符作为后参考文本
        let nextText = questionArray.slice(blankIndex + 1).join('').replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '').slice(0, 3);
        // 如果是最后一个空缺，将 nextText 设为空字符串
        if (j === blankIndices.length - 1) {
            nextText = "";
        }
        // 从上次匹配结束位置开始查找前参考文本，允许一定范围的回溯
        let searchStart = Math.max(0, lastMatchedIndex - 5); 
        let prevIndex = preprocessedTips.indexOf(prevText, searchStart);
        if (prevIndex !== -1) {
            prevIndex += prevText.length;
        } else {
            console.log(`第 ${j} 个空缺前参考文本 "${prevText}" 在提示文本中未找到`);
            continue;
        }
        // 在提示文本中查找后参考文本的开始位置
        let nextIndex;
        if (nextText) {
            nextIndex = preprocessedTips.indexOf(nextText, prevIndex);
            if (nextIndex === -1) {
                console.log(`第 ${j} 个空缺后参考文本 "${nextText}" 在提示文本中未找到`);
                if (blankInfo.type === 'number') {
                    // 若后参考文本未找到，按空格长度提取，并限制最大长度
                    nextIndex = Math.min(prevIndex + blankInfo.length, preprocessedTips.length);
                } else {
                    continue;
                }
            }
        } else {
            // 如果 nextText 为空，缺失词为 prevIndex 到提示文本末尾
            nextIndex = preprocessedTips.length;
        }
        // 提取缺失词
        let missingWord = preprocessedTips.slice(prevIndex, nextIndex);
        missingWords.push(missingWord);
        // 更新上一次匹配结束的位置
        lastMatchedIndex = nextIndex;
    }
    console.log("最终提取的缺失词语为:", missingWords);
    return missingWords;
}
// function extractMissingWords3(questionArray, tipsStr, sentence) {//原版的3单多选
//     if(sentence.includes('错别字')){
//         return extractMissingWords对比错字(questionArray, tipsStr, sentence);
//     }
//     // 将题目数组拼接成完整的题目字符串
//     let question = questionArray.join('');
//     // 预处理：生成纯文字版本的题目和提示用于匹配
//     let preprocessedQuestion = question.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '');
//     let preprocessedTips = tipsStr.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '');
//     console.log("预处理后的题目：" + preprocessedQuestion);
//     console.log("预处理后的提示：" + preprocessedTips);
//     let missingWords = [];
//     let blankIndices = [];
//     // 找出所有空缺标识的位置
//     for (let i = 0; i < questionArray.length; i++) {
//         if (questionArray[i].startsWith('|')) {
//             blankIndices.push(i);
//         }
//     }
//     // 处理每个空缺
//     for (let j = 0; j < blankIndices.length; j++) {
//         let blankIndex = blankIndices[j];
//         // 找到空缺前的参考文本，取最后 20 个字符
//         let prevText = questionArray.slice(0, blankIndex).join('').replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '').slice(-20);
//         // 找到空缺后的参考文本，取前 20 个字符
//         let nextText = questionArray.slice(blankIndex + 1).join('').replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '').slice(0, 20);
//         // 如果是最后一个空缺，将 nextText 设为空字符串
//         if (j === blankIndices.length - 1) {
//             nextText = "";
//         }
//         // 处理参考文本为空的情况
//         if (!prevText && !nextText) {
//             console.log(`第 ${j} 个空缺前后参考文本均为空，跳过处理`);
//             continue;
//         }
//         // 在提示文本中查找前参考文本的结束位置
//         let prevIndex = preprocessedTips.indexOf(prevText);
//         if (prevIndex !== -1) {
//             prevIndex += prevText.length;
//         } else {
//             console.log(`第 ${j} 个空缺前参考文本 "${prevText}" 在提示文本中未找到`);
//         }
//         // 在提示文本中查找后参考文本的开始位置
//         let nextIndex;
//         if (nextText) {
//             nextIndex = preprocessedTips.indexOf(nextText, prevIndex);
//             if (nextIndex === -1) {
//                 console.log(`第 ${j} 个空缺后参考文本 "${nextText}" 在提示文本中未找到`);
//             }
//         } else {
//             // 如果 nextText 为空，缺失词为 prevIndex 到提示文本末尾
//             nextIndex = preprocessedTips.length;
//         }
//         // 提取缺失词
//         if (prevIndex !== -1 && nextIndex !== -1) {
//             let missingWord = preprocessedTips.slice(prevIndex, nextIndex);
//             missingWords.push(missingWord);
//         }
//     }

//     console.log("最终提取的缺失词语为:", missingWords);
//     return missingWords;
// }
function extractMissingWords1(questionArray, tipsStr, sentence) {//空格前后对比找出答案
    if(sentence.includes('错别字')){
        return extractMissingWords对比错字(questionArray, tipsStr, sentence);
    }
    console.log("原始题目数组:", questionArray);
    console.log("原始提示字符串:", tipsStr);
    // 预处理提示文本，去除多余空格、换行符和特殊字符
    tipsStr = tipsStr.replace(/\s+/g, ' ').trim();
    tipsStr = tipsStr.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, '');
    console.log("预处理后的提示字符串:", tipsStr);

    const questionText = questionArray.join('').replace(/\s+/g, ' ').trim().replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, '');
    console.log("预处理后的题目文本:", questionText);

    let missingWords = [];
    // 正则匹配空格长度标识（如 |4 或 4 这种形式）
    const blankRegex = /(\d+)(?=[\u4e00-\u9fa5a-zA-Z])/g;
    let match;
    while ((match = blankRegex.exec(questionText)) !== null) {
        const blankLength = parseInt(match[1], 10);
        const index = match.index;
        // 取空格长度前面的 3 个文字
        const prevText = questionText.slice(Math.max(0, index - 3), index);
        // 取空格长度后面的 3 个文字
        const nextText = questionText.slice(index + match[1].length, index + match[1].length + 3);

        // 在提示里查找前后参考文字的位置
        const prevIndex = tipsStr.indexOf(prevText);
        const nextIndex = tipsStr.indexOf(nextText);

        let start; // 将 start 变量声明移到 if-else if 结构外部
        let missingWord; // 将 missingWord 变量声明移到 if-else if 结构外部
        if (prevIndex !== -1 && nextIndex !== -1) {
            // 提取答案
            start = prevIndex + prevText.length;
            missingWord = tipsStr.slice(start, nextIndex);
            missingWords.push(missingWord);
        } else if (prevIndex !== -1) {
            // 若后参考文字未找到，按空格长度提取
            start = prevIndex + prevText.length;
            const end = start + blankLength;
            missingWord = tipsStr.slice(start, end);
            missingWords.push(missingWord);
        } else if (nextIndex !== -1) {
            // 当前参考文字未找到，而后参考文字找到时
            start = Math.max(0, nextIndex - blankLength);
            missingWord = tipsStr.slice(start, nextIndex);
            missingWords.push(missingWord);
        }
    }
    console.log("最终提取的缺失词语为:", missingWords);
    return missingWords;
}
function smartSplitAndMatch(target, candidates) {//智能匹配
    console.log(`[开始智能匹配] 目标词:「${target}」`); 
    // 异常处理增强
    if (!target || !candidates.length) {
        console.warn('[异常拦截] 空目标或空候选列表');
        return []; // 确保返回数组
    }
    // 动态规划数组安全初始化
    const dp = new Array(target.length + 1)
        .fill(null)
        .map(() => ({
            path: [],    // 明确初始化为空数组
            score: -Infinity
        }));
    dp[0].score = 0;
    // 带性能监控的匹配核心
    let totalOperations = 0;
    for (let i = 0; i < target.length; i++) {
        if (dp[i].score === -Infinity) {
            console.log(`[DP跳过] 位置 ${i} 无有效路径`);
            continue;
        }
        // 实时进度输出
        console.log(`[匹配进度] ${i}/${target.length}`, 
                   `当前字符:「${target[i]}」`);
        candidates.forEach(control => {
            const word = control.text;
            if (!word) return;
            // 长度剪枝优化
            if (word.length > target.length - i) {
                console.log(`[剪枝] 跳过过长候选词「${word}」`);
                return;
            }
            if (target.startsWith(word, i)) {
                const end = i + word.length;
                const newScore = dp[i].score + word.length * 2;   
                // 路径安全合并
                const newPath = dp[i].path.concat(control);
                if (newScore > dp[end].score) {
                    dp[end] = { path: newPath, score: newScore };
                    console.log(`[路径更新] ${i}→${end} 得分:${newScore}`, 
                              `词:「${word}」`);
                }
                totalOperations++;
            }
        });
    }
    // 带安全保护的回溯
    let result;
    if (dp[target.length].score > 0) {
        result = dp[target.length].path;
    } else {
        // 降级策略：寻找最长有效路径
        let bestIndex = target.length - 1;
        while (bestIndex > 0 && dp[bestIndex].score === -Infinity) {
            bestIndex--;
        }
        result = dp[bestIndex].path;
        console.warn(`[降级匹配] 仅匹配到前${bestIndex}个字符`);
    }
    // 最终结果验证
    console.log('[匹配完成] 最终路径:', 
        result.map(c => c.text).join(' → ') || '无结果');
    return result || []; // 双重保险返回数组
}
function getValidControls(parent) {//获取所有可点击的控件
    return parent.find(clickable(true))
        .filter(node => {
            const text = node.text() || "";
            return text.trim().length > 0;
        })
        .map(node => ({
            node: node,
            text: node.text().trim()
        }));
}
function processMissingWords(words, controls) {
    words.forEach(word => {
        console.log(`处理缺失词: ${word}`);
        const sequence = smartSplitAndMatch(word, controls);
        if (!sequence || sequence.length === 0) {
            console.error(`未找到匹配路径: ${word}`);
            return;
        }
        sequence.forEach((control, index) => {
            console.log(`点击 [${index + 1}/${sequence.length}]: ${control.text}`);
            control.node.click();
            sleep(300);
        });
    });
}
//25 0 1 
function dailyQuestionLoop() {
    var blankArray = [];
    var question = "";
    var answer = "";
    if (textStartsWith("填空题").exists()) {
        var { questionArray, flag } = getFitbQuestion(); //获取到了题目的问题，并把空值改成 |2 ，返回questionArray
        if (!Array.isArray(questionArray)) {
            console.error('questionArray 不是数组类型，无法使用 join 方法', questionArray);
            return;
        }
        var sentence = questionArray.join(''); // 把数组变成字符串
        sleep(10)
        questionArray.forEach(item => {
            // if (item != null && item.charAt(0) == "|") { //是空格数  子元素不为空且索引 ‘|’ 。子元素第一个文本为空，
            if(item != null && typeof item === 'string' && item.charAt(0) === "|") {
                blankArray.push(item.slice(1)); //ceing原来 从第二个开始，数组1234，slice（1），输出234。也就是|后面的文字
            } else { //是题目段
                question += item;
            }
        });
        question = question.replace(/\s/g, "");//去除空格
        // console.log("这是去除|和空格的题目：" + question);
        // var ansTiku = getAnswer(question, 'tiku');
        // if (ansTiku.length == 0) {//tiku表中没有则到tikuNet表中搜索答案
        //     ansTiku = getAnswer(question, 'tikuNet');
        // }
        // answer = ansTiku.replace(/(^\s*)|(\s*$)/g, "");ss
        if (answer == "") { //答案空，前面题库未找到答案,找提示
            var tipsStr = getTipsStr();//获取提示
            // answer = extractMissingWords(questionArray, tipsStr, sentence)
            var missingWords = extractMissingWords(questionArray, tipsStr, sentence);
            // var missingWords =extractAnswers(questionArray, tipsStr)
            answer = missingWords.join('');
            // answer = getAnswerFromTips(questionArray, tipsStr);
            if (flag == 1) {
                setText(0, answer.slice(0, blankArray[0]));
                if (blankArray.length > 1) {
                    for (var i = 1; i < blankArray.length; i++) {
                        setText(i, answer.slice(blankArray[i - 1], blankArray[i]));
                        sleep(50);
                    }
                }
                if (tipsStr === "请观看视频") {
                    log("请观看视频");
                    // 获取处理后的题目字符串
                    let question = questionArray.join('').replace(/\s/g, "");
                    console.log("处理后的题目文本:", question);
                    if (!question) {
                        console.log("处理后的题目文本为空，无法填入内容");
                        return;
                    }
                    // 检查 blankArray
                    if (!blankArray.length) {
                        console.log("blankArray 为空，没有填空框需要处理");
                        return;
                    }
                    // 遍历所有填空框，从题目里随机获取文本填入
                    for (let i = 0; i < blankArray.length; i++) {
                        const blankLengthStr = blankArray[i];
                        const blankLength = parseInt(blankLengthStr, 10);
                        if (isNaN(blankLength)) {
                            console.log(`无法将 blankArray[${i}] 的值 ${blankLengthStr} 解析为数字，跳过该填空框`);
                            continue;
                        }
                        if (question.length >= blankLength) {
                            // 随机生成起始索引
                            const startIndex = Math.floor(Math.random() * (question.length - blankLength + 1));
                            const randomText = question.slice(startIndex, startIndex + blankLength);
                            console.log(`准备为第 ${i} 个填空框填入文本: ${randomText}`);
                            setText(i, randomText);
                            console.log(`已为第 ${i} 个填空框填入文本: ${randomText}`);
                        } else {
                            // 若题目长度不足，直接填入题目文本
                            console.log(`题目长度不足，为第 ${i} 个填空框填入完整题目文本: ${question}`);
                            setText(i, question);
                            console.log(`已为第 ${i} 个填空框填入完整题目文本: ${question}`);
                        }
                        sleep(50);
                    }
                }
            }
            if (flag == 2) { //
                // 获取填空题父控件
                let parentControl = text("填空题").findOne(100).parent().parent();
                console.log("填空题父控件");
                if (parentControl) {
                    // 获取有效控件（直接过滤）
                    const candidateControls = getValidControls(parentControl);//获取所有可点击的控件
                    if (candidateControls.length === 0) {
                        console.error("没有可点击的有效选项");
                        return;
                    }
                    // 处理缺失词点击
                    // let mis = ["珠穆朗玛峰"]
                    // processMissingWords(mis, candidateControls);
                    processMissingWords(missingWords, candidateControls);//处理缺失词
                }
            }
            // extractMissingWords(questionArray, tipsStr) 
            // checkAndUpdate(question, ansTiku, answer);
        } else { //答案非空，题库中已找到答案
            console.info("答案：" + answer);
            setText(0, answer.slice(0, blankArray[0]));
            if (blankArray.length > 1) {
                for (var i = 1; i < blankArray.length; i++) {
                    setText(i, answer.slice(blankArray[i - 1], blankArray[i])); //substr原来
                }
            }
        }
    } else if (textStartsWith("多选题").exists() || textStartsWith("单选题").exists()) {
        var questionArray = getChoiceQuestion();//处理后的题目
        questionArray = convertQuestionArray(questionArray);
        var sentence = questionArray.join('');
        var blankArray = [];
        var question = "";
        questionArray.forEach(item => {
            if (item != null && item.charAt(0) === "|") {
                blankArray.push(item);
            } else {
                question += item;
            }
        });
        question = question.replace(/\s/g, "");
        if (question == ZiXingTi.replace(/\s/g, "") || question == DuYinTi.replace(/\s/g, "") || question == ErShiSiShi.replace(/\s/g, "")) {
            question = question + options[0];
        }
        console.log("去除空格的题目：" + question);
        if (answer == "") {
            var tipsStr = getTipsStr();
            var missingWords = extractMissingWords3(questionArray, tipsStr, sentence);
            var combinedMissingWords = missingWords.join('');
            // console.log("缺失词组合：" + combinedMissingWords);
            var options = [];
            let listView;
            if (className("ListView").exists()) {
                listView = className("ListView").findOne();
                listView.children().forEach(child => {
                    var answer_q = child.child(0).child(2).text();
                    options.push(answer_q);
                });
            } else {
                console.error("答案获取失败!");
                return;
            }
            console.log("获取到的选项列表：", options);

            // 统计 | 的数量作为答案数
            const answerCount = blankArray.length;
            const optionCount = options.length;
            var clickStr = "";
            var isFind = false;
            // 若答案数等于选项数量，全选所有选项
            if (answerCount === optionCount) {
                console.log("答案数等于选项数量，进行全选操作");
                options.forEach((option, index) => {
                    const targetChild = listView.child(index);
                    if (targetChild) {
                        try {
                            targetChild.child(0).click();
                            console.log(`成功点击选项：${option}`);
                            clickStr += listView.child(index).child(0).child(1).text().charAt(0);
                            isFind = true;
                        } catch (error) {
                            console.error(`点击选项 ${option} 时出错:`, error);
                        }
                    } else {
                        console.error(`未找到索引为 ${index} 的子元素，选项：${option}`);
                    }
                });
            } else {
                options.forEach((option, index) => {
                    const cleanOption = option.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '');
                    console.log(`正在检查选项：${option}，清理后：${cleanOption}`);
                    if (combinedMissingWords.includes(cleanOption)) {
                        console.log(`匹配到选项：${option}，索引：${index}`);
                        const targetChild = listView.child(index);
                        if (targetChild) {
                            try {
                                targetChild.child(0).click();
                                console.log(`成功点击选项：${option}`);
                                clickStr += listView.child(index).child(0).child(1).text().charAt(0);
                                isFind = true;
                            } catch (error) {
                                console.error(`点击选项 ${option} 时出错:`, error);
                            }
                        } else {
                            console.error(`未找到索引为 ${index} 的子元素，选项：${option}`);
                        }
                    } else {
                        console.log(`选项 ${option} 未匹配到缺失词`);
                    }
                });
            }
            if (!isFind) {
                if (tipsStr === "请观看视频") {
                    let listArray = className("ListView").findOnce().children();
                    let i = random(0, listArray.length - 1);
                    console.log("随机点击，索引：", i);
                    listArray[i].child(0).click();
                    clickStr += listArray[i].child(0).child(1).text().charAt(0);
                } else {
                    const listArray = className("ListView").findOnce().children();
                    if (listArray[0]) {
                        listArray[0].child(0).click();
                        console.log("点击第一个选项");
                        clickStr += listArray[0].child(0).child(1).text().charAt(0);
                    } else {
                        console.error("未找到第一个子元素");
                    }
                }
            }
            console.info("提示中的答案：" + clickStr);
        }
        //————————————————下面是原来的单选、多选————————————————————————
        // var questionArray = getChoiceQuestion();//处理后的题目
        // // sleep(2000)
        // questionArray.forEach(item => {
        //     if (item != null && item.charAt(0) == "|") { //是空格数
        //         blankArray.push(item.sliceing(1));
        //     } else { //是题目段
        //         question += item;
        //     }
        // });
        // // console.log("这是单多选de：" + blankArray);
        // // console.log("这是单多选de：" + question);
        // var options = []; //选项列表
        // if (className("ListView").exists()) { //选择题提取答案，为字形题 注音题准备
        //     className("ListView").findOne().children().forEach(child => {
        //         var answer_q = child.child(0).child(2).text(); //此处child(2)为去除选项A.的选项内容，与争上游不同,不选A，这是获取选项的内容
        //         options.push(answer_q);
        //         // console.log("选项的内容:" + answer_q);
        //     });
        // } else {
        //     console.error("答案获取失败!");
        //     return;
        // }
        // question = question.replace(/\s/g, ""); //去除题目里的空格 
        // if (question == ZiXingTi.replace(/\s/g, "") || question == DuYinTi.replace(/\s/g, "") || question == ErShiSiShi.replace(/\s/g, "")) {
        //     question = question + options[0]; //字形题 读音题 在题目后面添加第一选项 ，如果是这些题，就把A选项加上               
        // }
        // console.log("题目：" + question);
        // if (answer == "") {
        //     var tipsStr = getTipsStr(); //获取提示里的内容
        //     // answer = clickByTips111(findOutAns);  //clickByTips(tipsStr),提取到提示的内容，用选项的文本对比提示，有就点击，并返回选项ABCD
        //     answer = clickByTips(tipsStr); //原汁原味代码
        //     console.info("提示中的答案：" + answer);
        //     if (text("单选题").exists() || text("正确").exists()) { //仅单选题更新题库，多选题不更新进题库
        //         // checkAndUpdate(question, ansTiku, answer);
        //         // if (tipsStr.includes(question)) {
        //         //     text("正确").findOne(10).parent().click()
        //         // }else{
        //         //     text("错误").findOne(10).parent().click()
        //         // }
        //         console.log("不干嘛");

        //     }
        // } else {
        //     /*  console.info("答案：" + ansTiku);  //没有题库，相当于啥也不干，随便点寄一个
        //       sleep(100);//随机延时0.5-1秒
        //       clickByAnswer(answer);  //原来这里有个}zz，为了防止误导，放这里  */
        //     let listArray = className("ListView").findOnce().children(); //题目选项列表
        //     let i = random(0, listArray.length - 1);
        //     console.log("随机点击");
        //     listArray[i].child(0).click(); //随意点击一个答案
        //     clickStr += listArray[i].child(0).child(1).text().charAt(0)
        // }
    }
    sleep(1000); //随机延时0.5-1秒
    while (true) {
         if (text("确定").findOne(50)) { //循环判定  确定
             if (text("确定").exists()) { //每日每周答题
                 text("确定").click();
                 sleep(200); //随机延时0.5-1秒
             } else if (text("下一题").exists()) { //专项答题
                 text("下一题").click();
                 sleep(200); //随机延时0.5-1秒
             } else if (text("完成").exists()) { //专项答题最后一题
                 text("完成").click();
                 sleep(200); //随机延时0.5-1秒
             } else {
                 console.warn("未找到右上角按钮，尝试根据坐标点击");
                 click(device.width * 0.85, device.height * 0.06); //右上角确定按钮，根据自己手机实际修改
                 console.warn("请手动处理");
                 sleep(200);
             }
             console.log("---------------------------");
             sleep(100);
             break;
         }
         sleep(200); //循环等待确定
         // 下面是防止最后一题，1秒时间不够，误入答题，导致死循环判断 确定 是否存在，
         if (text("icon/24/icon_Y_shuaxin").exists()) {
             log("网络错误")
             break;
         }
         if (textStartsWith("本次答对题目数").exists()) {
             log("答完了")
             break;
         }
     }
}
function convertQuestionArray(questionArray) {//把题目数组转换成包含占位符的数组
    const newQuestionArray = [];
    const questionStr = questionArray.join('');
    // 正则匹配连续空格
    const spaceRegex = /\s{2,}/g;
    let lastIndex = 0;
    let match;
    while ((match = spaceRegex.exec(questionStr)) !== null) {
        // 添加空格前的文本
        newQuestionArray.push(questionStr.slice(lastIndex, match.index));
        // 添加占位符，空格数量作为占位符长度
        newQuestionArray.push(`|${match[0].length}`);
        lastIndex = match.index + match[0].length;
    }
    // 添加最后一部分文本
    newQuestionArray.push(questionStr.slice(lastIndex));
    return newQuestionArray;
}
function findCorrectAnswer(question, tipsStr, options) {
    for (let option of options) {
        if (!question.includes(option) && tipsStr.includes(option)) {
            return option;
        }
    }
    return null;
}
/**
 * @description: 获取填空题题目数组
 * @param: null
 * @return: questionArray
 */
function getFitbQuestion() {
    var questionArray = [];
    let flag
    try {
        let editTextElement = null;
        const maxAttempts = 15; // 最大尝试次数
        const interval = 100; // 每次尝试间隔 1 秒
        let attempts = 0;
        while (attempts < maxAttempts && !editTextElement) {
            editTextElement = className("EditText").findOnce();
            if (!editTextElement) {
                sleep(interval);
                attempts++;
            }
        }
        log("尝试次数：" + attempts);
        if (editTextElement) {
            // var questionCollections = className("EditText").findOne().parent().parent();
            var questionCollections = editTextElement.parent().parent();
            flag = 1
            var findBlank = false;
            var blankCount = 0;
            var blankNumStr = "";
            var i = 0;
            questionCollections.children().forEach(item => {
                if (item.className() != "android.widget.EditText") {
                    if (item.text() != "") { //题目段  不为空 就执行这里
                        if (findBlank) {
                            blankNumStr = "|" + blankCount.toString();
                            console.log("空格为" + blankNumStr);
                            questionArray.push(blankNumStr);
                            findBlank = false;
                        }
                        questionArray.push(item.text());
                    } else { //为空 就执行这里
                        findBlank = true; //在这赋值为真，记录，再次循环，直到被赋值为假
                        /*blankCount += 1;*/
                        blankCount = (className("EditText").findOnce(i).parent().childCount() - 1);
                        //假设填空框是2个，那么他们还有个兄弟是编辑框，一共3个，3兄弟的父亲是className("EditText").findOnce(i).parent()，  减去1个，就得到数量2
                        i++;
                    }
                }
            });
        } else {
            throw new Error('未找到 EditText 元素');
        }
    } catch (error) {
        flag = 2;
        let a = text("填空题").findOne(50)
        if (a) {
            var questionCollections = a.parent().parent()
            // if (questionCollections && questionCollections.childCount() > 1) {
            //         // 获取 questionCollections 下的第二个控件
            //         let questionControl = questionCollections.child(1);
            //         if (questionControl) {
            //             // 使用 findAllTexts 函数获取第二个控件下的所有文本
            //             let allTexts = findAllTexts(questionControl);
            //             console.log("第二个控件下的所有文本内容:", allTexts);
            //             // 拼接所有文本为一个字符串
            //             let combinedText = allTexts.join('');
            //             // 获取提示文本
            //             const tipsStr = getTipsStr();
            //             // 预处理提示文本，去除多余空格、换行符和特殊字符
            //             const preprocessedTips = tipsStr.replace(/\s+/g, ' ').trim().replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, '');
            //             // 预处理题目文本
            //             const preprocessedQuestion = combinedText.replace(/\s+/g, ' ').trim().replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, '');

            //             // 查找题目文本在提示文本中的位置
            //             let index = preprocessedTips.indexOf(preprocessedQuestion);
            //             if (index !== -1) {
            //                 // 找出可能缺失的内容
            //                 const possibleMissing = preprocessedTips.slice(0, index) + preprocessedTips.slice(index + preprocessedQuestion.length);
            //                 // 自动寻找插入空缺标识的位置
            //                 let insertIndex = -1;
            //                 // 遍历提示文本，查找第一个在题目文本中不存在的字符位置
            //                 for (let i = 0; i < preprocessedTips.length; i++) {
            //                     if (!preprocessedQuestion.includes(preprocessedTips[i])) {
            //                         // 找到对应在题目文本中的位置
            //                         let posInQuestion = preprocessedTips.slice(0, i).lastIndexOf(preprocessedQuestion);
            //                         if (posInQuestion !== -1) {
            //                             insertIndex = posInQuestion + preprocessedQuestion.length;
            //                             break;
            //                         }
            //                     }
            //                 }
            //                 if (insertIndex === -1) {
            //                     // 如果没找到合适位置，默认在题目末尾插入
            //                     insertIndex = combinedText.length;
            //                 }
            //                 // 添加空缺标识
            //                 combinedText = combinedText.slice(0, insertIndex) + `|${possibleMissing.length}` + combinedText.slice(insertIndex);
            //             }
            //             // 按空格和 | 分割文本为数组，并过滤空元素
            //             questionArray = combinedText.split(/\s|\|/).filter(item => item);
            //         }
            //     } else {
            //         console.log("未找到符合条件的父控件或父控件子元素不足");
            //     }
            // } else {
            //     console.log("未找到 '填空题' 控件");
            // }
            if (questionCollections && questionCollections.childCount() > 1) {
                let allTexts = findAllTexts(questionCollections);
                // console.log("父控件下的所有文本内容:", allTexts);
                // 拼接所有文本为一个字符串
                let combinedText = allTexts.join('');
                let extractedText = "";
                // 查找 "1/5" 的索引
                let startIndex = combinedText.indexOf('/5');
                if (startIndex !== -1) {
                    // 从 "1/5" 之后开始查找
                    startIndex += '/5'.length;
                    // 使用正则表达式查找 "来源" 或 "出题" 的位置
                    const regex = /来源|出题/;
                    const match = combinedText.slice(startIndex).match(regex);
                    const endIndex = match ? startIndex + match.index : -1;
                    if (endIndex !== -1) {
                        // 提取所需文本
                        extractedText = combinedText.slice(startIndex, endIndex);
                        // console.log("提取/5后、来源或出题前的文本内容:", extractedText);
                    } else {
                        console.log("未找到 '来源' 或 '出题' 文本");
                    }
                } else {
                    console.log("未找到 '/5' 文本");
                }
                questionArray = extractedText ? extractedText.split(' ') : [];
            } else {
                console.log("未找到符合条件的父控件");
            }
        }
    }//catch
    log("提取/5或 加| 后的题目：" + questionArray+"flag"+flag)
    return { questionArray, flag }
}

function findAllTexts(control) {//获取填空题祖控件下的所有文本内容
    let texts = [];
    if (control && control.text() && control.text().trim() !== "") {
        texts.push(control.text().trim());
    }
    if (control && control.childCount() > 0) {
        for (let i = 0; i < control.childCount(); i++) {
            let childTexts = findAllTexts(control.child(i));
            texts = texts.concat(childTexts);
        }
    }
    return texts;
}
function getFitbQuestion_11111() { //  ai代码
    var questionCollections = className("EditText").findOnce().parent().parent();
    var questionArray = [];
    var currentBlankCount = 0; // 当前空白的计数
    var inBlankSequence = false; // 是否在连续的空白序列中
    questionCollections.children().forEach(item => {
        if (item.className() === "android.widget.EditText") {
            // 如果是EditText，则增加空白计数，并标记为在空白序列中
            currentBlankCount++;
            inBlankSequence = true;
        } else if (item.text().trim() !== "") {
            // 如果不是EditText且有文本内容
            if (inBlankSequence) {
                // 如果之前是在空白序列中，则添加空白计数到问题数组
                questionArray.push("|" + (currentBlankCount - 1).toString());
                inBlankSequence = false; // 重置空白序列状态
                currentBlankCount = 0; // 重置当前空白计数
            }
            // 添加当前文本到问题数组
            questionArray.push(item.text().trim());
        }
    });

    // 检查循环结束后是否还有未处理的空白计数
    if (inBlankSequence) {
        questionArray.push("|" + (currentBlankCount - 1).toString());
    }
    return questionArray;
}

/**
 * @description: 获取选择题题目数组
 * @param: null
 * @return: questionArray
 */
function getChoiceQuestion() {
    var questionCollections = className("ListView").findOnce().parent().child(1);
    var questionArray = [];
    questionArray.push(questionCollections.text());
    log("处理后的单多选：" + questionArray)
    return questionArray;
}


/**
 * @description: 获取提示字符串
 * @param: null
 * @return: tipsStr
 */
function getTipsStr() {
    var tipsStr = "";
    let h = 0
    while (tipsStr == "") {
        if (text("查看提示").exists()) {
            var seeTips = text("查看提示").findOnce();
            seeTips.click();
            sleep(100);
            click(device.width * 0.5, device.height * 0.41);
            sleep(100);
            click(device.width * 0.5, device.height * 0.35);
        } else {
            console.error("未找到查看提示");
            if (text("下一题").exists()) { //专项答题
                text("下一题").click();
                sleep(100); //随机延时0.5-1秒
            }
            h++
        }
        if (text("提示").exists()) {
            var tipsLine = text("提示").findOnce().parent();
            //获取提示内容
            var tipsView = tipsLine.parent().child(1).child(0);
            tipsStr = tipsView.text();
            console.log("获取提示：", tipsStr);
            // 关闭提示
            tipsLine.child(1).click();
            break;
        }
        sleep(100);
        if (h >= 20) {//原12
            break;
        }
    }
    return tipsStr;
}


/**
 * @description: 从提示中获取填空题答案
 * @param: questionArray, tipsStr
 * @return: ansTips
 */
function getAnswerFromTips1(questionArray, tipsStr) { //题目数组 和 提示  的内容 原版
    var ansTips = "";
    for (var i = 1; i < questionArray.length - 1; i++) {
        if (questionArray[i].charAt(0) == "|") {
            var blankLen = questionArray[i].slice(1); //slice     substring原来
            var indexKey = tipsStr.indexOf(questionArray[i + 1]);
            var ansFind = tipsStr.substr(indexKey - blankLen, blankLen);
            /*ansTips += ansFind;*/
            ansTips = ansTips.concat(ansFind);
        }
    }
    console.log("1199:" + ansTips);
    return ansTips;
}

function getAnswerFromTips(questionArray, tipsStr) {//已经被missingWords替代
    let ansTips = '';
    let searchIndex = 0; // 记录下一次查找的起始位置
    for (let i = 0; i < questionArray.length - 1; i++) {
        if (questionArray[i].startsWith('|')) {
            let blankLength = parseInt(questionArray[i].substring(1), 10);
            if (isNaN(blankLength)) {
                console.log(`无法解析空缺长度，当前元素: ${questionArray[i]}`);
                continue;
            }
            let keyword = questionArray[i + 1].trim();
            let startIndex = tipsStr.indexOf(keyword, searchIndex);
            if (startIndex !== -1) {
                // 避免索引越界
                let start = Math.max(0, startIndex - blankLength);
                let ansFind = tipsStr.substring(start, startIndex);
                ansTips = ansTips.concat(ansFind);
                // 更新下一次查找的起始位置
                searchIndex = startIndex + keyword.length;
            } else {
                console.log(`未在提示字符串中找到关键字: ${keyword}`);
            }
        }
    }
    console.log("答案是:" + ansTips);
    return ansTips;
}
function getAnswerFromTips0(questionArray, tipsStr) {//修改版
    let ansTips = '';
    for (let i = 1; i < questionArray.length - 1; i++) {
        if (questionArray[i].startsWith('|')) {//questionArray[0]是空白之前，questionArray[1]是|3，questionArray[2]是空白之后的内容
            // let blankLength = questionArray[i].length - 1;//空白长度假设为|3
            let blankLength = parseInt(questionArray[i].substring(1), 10);
            let keyword = questionArray[i + 1];//关键字就是|3后面的内容
            let startIndex = tipsStr.indexOf(keyword);//索引关键字在提示里的位置
            if (startIndex !== -1) {
                // let ansFind = tipsStr.substring(startIndex + keyword.length, startIndex + keyword.length + blankLength);
                let ansFind = tipsStr.substring(startIndex - blankLength, startIndex);
                ansTips = ansTips.concat(ansFind); // 恢复这行代码
            }
        }
    }
    // console.log("空白长度:" + blankLength);
    console.log("1199:" + ansTips);
    return ansTips;
}
/*
 * @description: 根据提示点击选择题选项
 * @param: tipsStr
 * @return: clickStr
 */
function clickByTips(tipsStr) { //原汁原味代码
    // function clickByTips(findOutAns) { ///////////////
    var clickStr = "";
    var isFind = false;
    if (className("ListView").exists()) {
        var listArray = className("ListView").findOne().children(); //获取listview的直接子元素数组，也就是选项
        listArray.forEach(item => {
            var ansStr = item.child(0).child(2).text(); //实际是选项里的文本， item最大的选项，child(0)是item的第一个孩子，child(2)是选项内容，child(1)是A.
            if (tipsStr.indexOf(ansStr) >= 0) { //用选项答案在提示里遍历，有就点击
                // if (tipsStr.indexOf(ansStr) >= 0) {
                item.child(0).click();
                clickStr += item.child(0).child(1).text().charAt(0); //从每个列表项的第一个子元素的第二个子元素中提取文本的第一个字符，并将其视为列表索引。也就是去掉 选项ABCD后面的 . 并返回文本ABCD
                isFind = true;
            }
        });
        // con         sole.log("索引后未知的"+ ansStr);
        // con         sole.log("对比后返回答案"+ clickStr)
        if (!isFind) { //没有找到 点击第一个
            if (tipsStr === "请观看视频") {
                let listArray = className("ListView").findOnce().children(); //题目选项列表
                let i = random(0, listArray.length - 1);
                console.log("随机点击");
                listArray[i].child(0).click(); //随意点击一个答案
                clickStr += listArray[i].child(0).child(1).text().charAt(0)
            } else {
                listArray[0].child(0).click();
                console.log("dian????:");
                clickStr += listArray[0].child(0).child(1).text().charAt(0);
            }
        }
    }
    return clickStr;
}

/**
 * @description: 根据答案点击选择题选项
 * @param: answer
 * @return: null
 */
function clickByAnswer(answer) {
    if (className("ListView").exists()) {
        var listArray = className("ListView").findOnce().children();
        listArray.forEach(item => {
            var listIndexStr = item.child(0).child(1).text().charAt(0); //选项A. B. C. D. ，去掉了后面的 .
            //单选答案为非ABCD
            var listDescStr = item.child(0).child(2).text(); //选项A. B. C. D.
            if (answer.indexOf(listIndexStr) >= 0 || answer == listDescStr) {
                item.child(0).click();
            }
        });
        console.log("点击答案？：" + listIndexStr)
        console.log("不明白!：" + listDescStr)
    }
}