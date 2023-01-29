"use strict";

/* 구현 순서
  1. 단어를 한 글자씩 쪼갠다.
  2. 쪼갠 글자를 유니코드로 변환한다.
  3. 유니코드에서 초성~종성의 값을 구한다.
 */

// 첫 문자인 "가"에 해당하는 값
const korGAUnicode = 0xAC00;
// 초성, 중성, 종성 시작 값
const [firstInitial, firstMedial, firstFinal] = [0x1100, 0x1161, 0x11A7];
// 초성, 중성, 종성 개수
const [initialCount, medialCount, finalCount] = [18, 21, 28];

/**
 * 한국어 자소 분리를 진행한다.
 *
 * param을 한 글자씩 쪼개어 한국어일 경우에만 자소 분리를 수행한다.
 *
 * @since 2023-01-29
 * @param {String} word 자소 분리를 진행할 한국어
 * @returns {Object[]} {isKorean: Boolean, initial: String, medial: String||null, final: String||null}
 */
const getGraphemeList = (word) => {
  if (word.length < 1) {
    throw new Error("매개 변수는 한 글자이상이어야 합니다.");
  }

  return splitWord(word).reduce((arr, letter) => {
    if (letter.match(/[ㄱ-ㅎ|가-힣]/g)) { // 한글일 때만 자소 분리
      let {initial, medial, final} = splitGrapheme(getUnicode(letter));

      arr.push({
        isKorean: true,
        initial: getInitialLetter(initial),
        medial: getMedialLetter(medial),
        final: getFinalLetter(final)
      });
    } else {
      arr.push({
        isKorean: false,
        initial: letter
      });
    }

    return arr;
  }, []);
}

/**
 * unicode에 해당하는 한글을 반환한다.
 *
 * @since 2023-01-29
 * @param {Number} unicode 한글로 변환할 unicode
 * @returns {string} 한글
 */
const getLetterFromUnicode = (unicode) => {
  return String.fromCharCode(unicode);
}

/**
 * unicode에 해당하는 초성 값을 반환한다.
 *
 * @since 2023-01-29
 * @param {Number} unicode 한글로 변환할 초성 unicode
 * @returns {string} 한글(초성)
 */
const getInitialLetter = (unicode) => {
  return getLetterFromUnicode(unicode + firstInitial);
}

/**
 * unicode에 해당하는 중성 값을 반환한다.
 *
 * @since 2023-01-29
 * @param {Number} unicode 한글로 변환할 중성 unicode
 * @returns {string} 한글(중성)
 */
const getMedialLetter = (unicode) => {
  return getLetterFromUnicode(unicode + firstMedial);
}

/**
 * unicode에 해당하는 종성 값을 반환한다.
 *
 * @since 2023-01-29
 * @param {Number} unicode 한글로 변환할 종성 unicode
 * @returns {string} 한글(종성)
 */

const getFinalLetter = (unicode) => {
  return getLetterFromUnicode(unicode + firstFinal);
}

/**
 * 단어를 한 글자씩 쪼개어 배열로 반환한다.
 *
 * @since 2023-01-29
 * @param {String} word 쪼갤 단어
 * @returns {String[]} 한 글자씩 쪼개진 결과
 */
const splitWord = (word) => {
  return [...word];
}

/**
 * unicode에 해당하는 글자를 자소 분리한다.
 *
 * @since 2023-01-29
 * @param {Number} unicode 자소 분리할 글자
 * @returns {Object} {initial, medial, final} 자소 분리 결과
 */
const splitGrapheme = (unicode) => {
  let initial = getInitialIndex(unicode);
  let medial = getMedialIndex(unicode);
  let final = getFinalIndex(unicode);

  return {initial, medial, final};
}

/**
 * 글자에 해당하는 unicode 값을 구한다.
 *
 * @since 2023-01-29
 * @param {String} letter unicode로 변환할 글자
 * @returns {number} unicode
 */
const getUnicode = (letter) => {
  if (letter.length !== 1) {
    throw new Error("매개 변수는 한 글자여야 합니다.");
  }

  return letter.codePointAt(0);
}

/**
 * unicode가 가지고 있는 초성이 jomo block에서 몇 번째 글자인지 구한다.
 *
 * @since 2023-01-29
 * @param {Number} unicode 초성 순서 값을 구할 글자 unicode
 * @returns {number} 초성 순서(순서는 Hangul Jamo Unicode block 순서에 의거함)
 * @link https://en.wikipedia.org/wiki/Hangul_Jamo_(Unicode_block)
 */
const getInitialIndex = (unicode) => {
  if (typeof unicode !== "number") {
    throw new Error("unicode는 숫자여야합니다.");
  }

  return Math.floor((unicode - korGAUnicode) / (medialCount * finalCount));
}

/**
 * unicode가 가지고 있는 중성이 jomo block에서 몇 번째 글자인지 구한다.
 *
 * @since 2023-01-29
 * @param {Number} unicode 중성 순서 값을 구할 글자 unicode
 * @returns {number} 중성 순서(순서는 Hangul Jamo Unicode block 순서에 의거함)
 * @link https://en.wikipedia.org/wiki/Hangul_Jamo_(Unicode_block)
 */
const getMedialIndex = (unicode) => {
  if (typeof unicode !== "number") {
    throw new Error("unicode는 숫자여야합니다.");
  }

  return Math.floor((unicode - korGAUnicode) / finalCount % medialCount);
}

/**
 * unicode가 가지고 있는 종성이 jomo block에서 몇 번째 글자인지 구한다.
 *
 * @since 2023-01-29
 * @param {Number} unicode 종성 순서 값을 구할 글자 unicode
 * @returns {number} 종성 순서(순서는 Hangul Jamo Unicode block 순서에 의거함)
 * @link https://en.wikipedia.org/wiki/Hangul_Jamo_(Unicode_block)
 */
const getFinalIndex = (unicode) => {
  if (typeof unicode !== "number") {
    throw new Error("unicode는 숫자여야합니다.");
  }

  return Math.floor((unicode - korGAUnicode) % finalCount);
}

