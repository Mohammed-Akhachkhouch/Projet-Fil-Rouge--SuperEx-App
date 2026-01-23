# Responsive Design - Quick Reference

> **ملاحظة:** هذا الملف للمرجع فقط. استخدم الأمثلة في ملفاتك الخاصة.

## 📦 Import Utilities

```javascript
import { 
  scaleFontSize, 
  scaleWidth, 
  scaleHeight, 
  moderateScale, 
  getResponsivePadding,
  DIMENSIONS,
  isTablet,
  isSmallDevice
} from '../../utils/responsive';
import { Platform, StyleSheet } from 'react-native';
```

---

## 1️⃣ FONT SIZES

### ❌ قبل:
```javascript
const styles = StyleSheet.create({
  title: { fontSize: 24 },
  subtitle: { fontSize: 18 },
  body: { fontSize: 14 }
});
```

### ✅ بعد:
```javascript
const styles = StyleSheet.create({
  title: { fontSize: scaleFontSize(24) },
  subtitle: { fontSize: scaleFontSize(18) },
  body: { fontSize: scaleFontSize(14) }
});
```

---

## 2️⃣ PADDING & MARGINS

### ❌ قبل:
```javascript
const styles = StyleSheet.create({
  container: { padding: 20, margin: 16 },
  button: { paddingVertical: 12, paddingHorizontal: 24 }
});
```

### ✅ بعد:
```javascript
const styles = StyleSheet.create({
  container: { 
    padding: getResponsivePadding(), // يختار تلقائياً حسب الجهاز
    margin: moderateScale(16) 
  },
  button: { 
    paddingVertical: moderateScale(12), 
    paddingHorizontal: moderateScale(24) 
  }
});
```

---

## 3️⃣ BORDER RADIUS

### ❌ قبل:
```javascript
const styles = StyleSheet.create({
  card: { borderRadius: 16 },
  button: { borderRadius: 8 }
});
```

### ✅ بعد:
```javascript
const styles = StyleSheet.create({
  card: { borderRadius: moderateScale(16) },
  button: { borderRadius: moderateScale(8) }
});
```

---

## 4️⃣ FIXED WIDTHS & HEIGHTS

### ❌ قبل:
```javascript
const styles = StyleSheet.create({
  image: { width: 80, height: 80 },
  icon: { width: 40, height: 40 }
});
```

### ✅ بعد:
```javascript
const styles = StyleSheet.create({
  image: { 
    width: scaleWidth(80), 
    height: scaleWidth(80) // استخدم scaleWidth للمربعات
  },
  icon: { 
    width: scaleWidth(40), 
    height: scaleWidth(40) 
  }
});
```

---

## 5️⃣ RESPONSIVE IMAGES

### ❌ تجنب:
```javascript
const styles = StyleSheet.create({
  banner: { width: '100%', height: 200 }
});
```

### ✅ استخدم:
```javascript
const styles = StyleSheet.create({
  banner: { 
    width: '100%', 
    aspectRatio: 16/9 // أو 1 للمربع، 4/3، etc.
  }
});
```

---

## 6️⃣ PLATFORM-SPECIFIC STYLES

### ✅ Method 1: Conditional
```javascript
const styles = StyleSheet.create({
  card: {
    // Shadow لـ iOS
    shadowColor: '#000',
    shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0,
    shadowRadius: Platform.OS === 'ios' ? 5 : 0,
    shadowOffset: Platform.OS === 'ios' ? { width: 0, height: 2 } : { width: 0, height: 0 },
    // Elevation لـ Android
    elevation: Platform.OS === 'android' ? 5 : 0,
  }
});
```

### ✅ Method 2: Platform.select()
```javascript
const styles = StyleSheet.create({
  text: {
    fontSize: scaleFontSize(16),
    ...Platform.select({
      ios: {
        fontFamily: 'System',
      },
      android: {
        fontFamily: 'Roboto',
      }
    })
  }
});
```

---

## 7️⃣ DEVICE-SPECIFIC LAYOUTS

```javascript
const styles = StyleSheet.create({
  container: {
    padding: isTablet() 
      ? moderateScale(32) 
      : isSmallDevice() 
        ? moderateScale(12)
        : moderateScale(16),
    
    flexDirection: isTablet() ? 'row' : 'column'
  }
});
```

---

## 8️⃣ SAFE AREA HANDLING

```javascript
// ✅ استخدم SafeAreaView دائماً
import { SafeAreaView } from 'react-native-safe-area-context';

function MyScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
      {/* محتواك */}
    </SafeAreaView>
  );
}

// ✅ للـ Status Bar
import { StatusBar } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'android' 
      ? StatusBar.currentHeight 
      : 0
  }
});
```

---

## 9️⃣ DIMENSIONS

```javascript
import { DIMENSIONS } from '../../utils/responsive';

console.log(DIMENSIONS.SCREEN_WIDTH);      // عرض الشاشة
console.log(DIMENSIONS.SCREEN_HEIGHT);     // ارتفاع الشاشة
console.log(DIMENSIONS.STATUS_BAR_HEIGHT); // ارتفاع status bar
console.log(DIMENSIONS.IS_SMALL_DEVICE);   // true/false
console.log(DIMENSIONS.IS_TABLET);         // true/false
```

---

## 🔟 COMPLETE EXAMPLE

```javascript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scaleFontSize, moderateScale, scaleWidth, getResponsivePadding } from '../../utils/responsive';

export default function ExampleScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.container}>
        <Text style={styles.title}>مثال كامل</Text>
        
        <View style={styles.card}>
          <Image 
            source={{ uri: 'https://example.com/image.jpg' }}
            style={styles.image}
          />
          <Text style={styles.cardText}>نص البطاقة</Text>
        </View>
        
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>اضغط هنا</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F9FC'
  },
  container: {
    padding: getResponsivePadding(),
  },
  title: {
    fontSize: scaleFontSize(24),
    fontWeight: '800',
    color: '#111',
    marginBottom: moderateScale(20)
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    marginBottom: moderateScale(16),
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: Platform.OS === 'ios' ? 0.1 : 0,
    shadowRadius: Platform.OS === 'ios' ? 10 : 0,
    shadowOffset: { width: 0, height: 2 },
    // Android elevation
    elevation: Platform.OS === 'android' ? 3 : 0,
  },
  image: {
    width: '100%',
    aspectRatio: 16/9,
    borderRadius: moderateScale(12),
    marginBottom: moderateScale(12)
  },
  cardText: {
    fontSize: scaleFontSize(16),
    color: '#333'
  },
  button: {
    height: moderateScale(56),
    backgroundColor: '#34A853',
    borderRadius: moderateScale(16),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: moderateScale(20)
  },
  buttonText: {
    fontSize: scaleFontSize(16),
    fontWeight: '700',
    color: '#fff'
  }
});
```

---

## 💡 TIPS

1. ✅ استخدم `scaleFontSize()` لكل fontSize
2. ✅ استخدم `moderateScale()` للـ padding, margin, borderRadius
3. ✅ استخدم `scaleWidth()` للعرض/الارتفاع الثابت
4. ✅ استخدم `aspectRatio` للصور المرنة
5. ✅ استخدم `Platform.OS` للفرق بين iOS و Android
6. ✅ استخدم `SafeAreaView` دائماً
7. ✅ اختبر على أجهزة مختلفة!

---

## 📚 ملفات للمراجعة

- `utils/responsive.js` - جميع الـ functions المساعدة
- `ANDROID_IOS_FIX_AR.md` - دليل كامل بالعربية
- `RESPONSIVE_GUIDE.md` - دليل تقني
- `CHANGES_SUMMARY_AR.md` - ملخص التعديلات
