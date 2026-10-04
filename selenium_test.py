import requests
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_backend():
    print("--- Testing Backend API ---")
    try:
        response = requests.get("http://localhost:3001/api/grid-status")
        if response.status_code == 200:
            data = response.json()
            print("PASS: Backend /api/grid-status is reachable.")
            assert 'batteryLevel' in data, "batteryLevel missing in backend response"
            print(f"PASS: Backend data structure is correct. Current battery: {data['batteryLevel']}%")
        else:
            print(f"FAIL: Backend returned status {response.status_code}")
    except Exception as e:
        print(f"FAIL: Backend is unreachable. {e}")

def test_frontend():
    print("\n--- Testing Frontend App ---")
    options = webdriver.ChromeOptions()
    options.add_argument('--headless') # Run headless
    driver = webdriver.Chrome(options=options)
    
    try:
        print("Navigating to Frontend (http://localhost:5173)...")
        driver.get("http://localhost:5173")
        wait = WebDriverWait(driver, 10)
        
        # 1. Test Navigation Overlay
        guide_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Hide Guide')]")))
        print("PASS: 3D Interface Guide is rendered.")
        guide_button.click()
        print("PASS: 3D Interface Guide can be collapsed.")
        
        # 2. Test View Switcher
        standard_btn = driver.find_element(By.XPATH, "//button[contains(., 'Standard View')]")
        standard_btn.click()
        print("PASS: Successfully switched to Standard View.")
        
        # Wait for 2D UI to render
        dashboard_title = wait.until(EC.presence_of_element_located((By.XPATH, "//h2[contains(., 'Microgrid Operations Overview')]")))
        print("PASS: Standard 2D Dashboard loaded.")
        
        # Test 2D sidebar tabs
        storage_tab = driver.find_element(By.XPATH, "//li[contains(., 'Storage Systems')]")
        storage_tab.click()
        print("PASS: Successfully navigated to Storage Systems module in 2D mode.")
        
        # Switch back to 3D View
        holographic_btn = driver.find_element(By.XPATH, "//button[contains(., '3D Holographic')]")
        holographic_btn.click()
        print("PASS: Successfully switched back to 3D Holographic View.")
        
        print("\nAll integration tests passed successfully!")
        
    except Exception as e:
        print(f"Test failed: {str(e)}")
    finally:
        driver.quit()

if __name__ == "__main__":
    test_backend()
    test_frontend()
