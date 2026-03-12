import requests
import json

# API 설정
BASE_URL = "https://apis.data.go.kr/B553530/CAREFF/CAREFF_LIST" 
SERVICE_KEY = "f16d0dab955eaf93856711c18a3d919b89409b1b96bce52fa957650a2f3d69da"

def check_2025_data():
    print("🔍 2025년식 데이터 존재 여부 확인 중...")
    
    # 2025년도 필터 적용
    params = {
        'serviceKey': SERVICE_KEY,
        'pageNo': '1',
        'numOfRows': '10',
        'apiType': 'json',
        'q4': '2025' # 출시년도 필터
    }
    
    try:
        response = requests.get(BASE_URL, params=params, timeout=15)
        if response.status_code == 200:
            data = response.json()
            total_count = data.get('response', {}).get('body', {}).get('totalCount', 0)
            print(f"📡 API 서버 응답: 2025년식 데이터 총 {total_count}건 발견")
            
            if int(total_count) > 0:
                items = data.get('response', {}).get('body', {}).get('items', {}).get('item', [])
                print("📋 2025년식 샘플 데이터:")
                for item in items[:3]:
                    print(f"   - {item.get('COMP_NM')} {item.get('MODEL_NM')} ({item.get('YEAR')}년식)")
            else:
                print("❌ 서버에 2025년식 데이터가 아직 등록되지 않은 것 같습니다.")
        else:
            print(f"❌ API 호출 실패 (상태 코드: {response.status_code})")
            
    except Exception as e:
        print(f"❌ 오류 발생: {e}")

if __name__ == "__main__":
    check_2025_data()
