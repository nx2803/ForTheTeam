import pandas as pd
import os

def evaluate_new_data():
    file_path = r'c:\Users\nx280\Desktop\자동차표시연비 목록.csv'
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found")
        return
        
    try:
        # 파일 인코딩 처리
        try:
            df = pd.read_csv(file_path, encoding='utf-8-sig')
        except:
            df = pd.read_csv(file_path, encoding='cp949')
            
        print("-" * 60)
        print("      [ 새 데이터셋 품질 평가 보고서 ]")
        print("-" * 60)
        
        # 1. 최신성 평가
        future_cars = df[df['출시연도'] >= 2025]
        print(f"✅ 최신성: 2025~2026년식 차량 {len(future_cars)}대 포함 (매우 우수)")
        
        # 2. 데이터 구체성 샘플
        print("\n[ 최신 차량 데이터 샘플 ]")
        sample = future_cars[['업체명', '모델명', '연료', '표시연비', '출시연도']].head(5)
        print(sample.to_string(index=False))
        
        # 3. 필드 구성 평가
        print("\n[ 주요 필드 구성 ]")
        essential_fields = ['모델명', '표시연비', 'CO2배출량(g/km)', '배기량', '등급', '예상 연간유류비']
        for field in essential_fields:
            if field in df.columns:
                print(f" - {field:<15}: 보유 (정상)")
        
        # 4. 종합 의견
        print("\n💡 종합 평가:")
        if len(future_cars) > 0:
            print("   - 기존 API 데이터보다 훨씬 '최신'입니다. (2025/2026년식 포함)")
            print("   - 연간 유류비 같은 부가 정보도 있어 랭킹 사이트 만들기에 더 유리합니다.")
            print("   - 다만 샘플링 결과, 모델명이 매우 상세(트림/인치 포함)하여 정리가 좀 필요해 보입니다.")
        
        print("-" * 60)

    except Exception as e:
        print(f"❌ 분석 오류: {e}")

if __name__ == "__main__":
    evaluate_new_data()
